import { useState, useEffect, useMemo } from 'react';
import {
    FilePdf as FilePdfIcon,
    FileXls as FileXlsIcon,
    ChartBar as ChartBarIcon,
} from '@phosphor-icons/react';
import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import useFirstLoad from '../hooks/useFirstLoad';
import LaporanSkeleton from '../components/LaporanSkeleton';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

/**
 * Halaman Utama Laporan - Menghubungkan visualisasi data ke statistik riil dari API.
 */
const Laporan = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('laporan', 400);
    const [fetchLaporan, { data: reportData, loading }] = useApi();
    
    // State untuk filter bulan dan tahun (Default sekarang)
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const loadData = async () => {
        try {
            await fetchLaporan('GET', `/laporan?bulan=${month}&tahun=${year}`);
        } catch (err) {
            if (err.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchLaporan, month, year, navigate]);

    const stats = reportData?.data || {
        total_pemasukan: 0,
        total_pengeluaran: 0,
        saldo_bersih: 0,
        per_kategori: [],
        transaksi_terbesar: []
    };

    const formatIDR = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    const tableColumns = [
        { label: 'Deskripsi', key: 'nama_transaksi' },
        { label: 'Kategori', key: 'nama_kategori', hideOnMobile: true },
        { label: 'Tanggal', key: 'tanggal', align: 'center', className: 'text-gray-500', hideOnMobile: true },
        {
            label: 'Jumlah', key: 'jumlah', align: 'right',
            render: (val) => <span className="font-semibold text-secondary">Rp {formatIDR(val)}</span>
        },
    ];

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    if (isFirstLoad || (loading && !reportData)) return <LaporanSkeleton />;

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-8 py-8 flex-shrink-0 gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Laporan Keuangan</h1>
                    <p className="text-sm text-gray-500 font-medium">Analisis arus kas dan distribusi pengeluaran Anda</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button size="md" variant="primary" icon={<FilePdfIcon size={18} weight="bold" />}>PDF</Button>
                    <Button size="md" variant="secondary" icon={<FileXlsIcon size={18} weight="bold" />}>Excel</Button>
                </div>
            </div>

            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                {/* Selector Periode */}
                <div className="flex gap-4 items-center bg-white p-4 rounded-xl ring-1 ring-gray-950/5 shadow-sm w-fit">
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-secondary focus:ring-0 cursor-pointer"
                    >
                        {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                    <select 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-secondary focus:ring-0 cursor-pointer"
                    >
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard title="Total Pemasukan" amount={formatIDR(stats.total_pemasukan)} />
                    <SummaryCard title="Total Pengeluaran" amount={formatIDR(stats.total_pengeluaran)} />
                    <SummaryCard title="Saldo Bersih" amount={formatIDR(stats.saldo_bersih)} />
                </div>

                {/* Per Kategori Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl ring-1 ring-gray-950/5 shadow-sm">
                        <h2 className="text-[16px] font-bold text-secondary mb-6">Pengeluaran per Kategori</h2>
                        <div className="space-y-4">
                            {stats.per_kategori.map((cat, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-600">{cat.nama_kategori}</span>
                                        <span className="font-bold text-secondary">Rp {formatIDR(cat.total)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${Math.min(100, (cat.total / stats.total_pengeluaran) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {stats.per_kategori.length === 0 && <p className="text-gray-400 italic text-sm">Belum ada data pengeluaran.</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl ring-1 ring-gray-950/5 shadow-sm overflow-hidden flex flex-col">
                        <h2 className="text-[16px] font-bold text-secondary mb-4">Transaksi Terbesar</h2>
                        <div className="flex-grow">
                            <Table columns={tableColumns} data={stats.transaksi_terbesar} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Laporan;
