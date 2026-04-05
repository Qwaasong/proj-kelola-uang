import { useState, useEffect, useRef } from 'react';
import {
    DownloadSimpleIcon,
    FileXlsIcon,
    FilePdfIcon,
    CaretDownIcon,
    ChartBarIcon,
    ChartPieIcon,
    TrendUpIcon,
    TrendDownIcon,
    InfoIcon
} from '@phosphor-icons/react';
import Chart from 'chart.js/auto';
import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import useFirstLoad from '../hooks/useFirstLoad';
import LaporanSkeleton from '../components/LaporanSkeleton';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

// --- Data Dummy ---
const PERIODS = ['Minggu Ini', 'Bulan Ini', '3 Bulan', 'Tahun Ini'];

const trendData = {
    'Minggu Ini': {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        pemasukan: [400000, 0, 250000, 0, 600000, 0, 0],
        pengeluaran: [120000, 85000, 200000, 50000, 175000, 310000, 0],
    },
    'Bulan Ini': {
        labels: ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'],
        pemasukan: [2400000, 0, 2400000, 0],
        pengeluaran: [800000, 650000, 750000, 580000],
    },
    '3 Bulan': {
        labels: ['Feb', 'Mar', 'Apr'],
        pemasukan: [4800000, 4800000, 4800000],
        pengeluaran: [3200000, 3650000, 2780000],
    },
    'Tahun Ini': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
        pemasukan: [4800000, 4800000, 4800000, 4800000, 4800000, 4800000, 0, 0, 0, 0, 0, 0],
        pengeluaran: [3800000, 3200000, 3650000, 2780000, 0, 0, 0, 0, 0, 0, 0, 0],
    },
};

const categoryData = [
    { label: 'Makan & Minum', value: 35, color: '#408A71' },
    { label: 'Transportasi', value: 20, color: '#639E88' },
    { label: 'Hiburan', value: 15, color: '#8093F1' },
    { label: 'Dana Darurat', value: 18, color: '#FF8A8A' },
    { label: 'Lainnya', value: 12, color: '#FBB040' },
];

const topPengeluaran = [
    { id: 1, deskripsi: 'Makan Siang Kantin', kategori: 'Makan & Minum', tanggal: '28 Mar 2026', jumlah: '125.000' },
    { id: 2, deskripsi: 'Grab Car ke Kantor', kategori: 'Transportasi', tanggal: '27 Mar 2026', jumlah: '87.000' },
    { id: 3, deskripsi: 'Netflix Langganan', kategori: 'Hiburan', tanggal: '25 Mar 2026', jumlah: '75.000' },
    { id: 4, deskripsi: 'Belanja Mingguan', kategori: 'Kebutuhan', tanggal: '24 Mar 2026', jumlah: '320.000' },
    { id: 5, deskripsi: 'Transfer Dana Darurat', kategori: 'Dana Darurat', tanggal: '20 Mar 2026', jumlah: '500.000' },
];

const CATEGORY_BADGE_COLORS = {
    'Makan & Minum': 'bg-gray-100 text-gray-600',
    'Transportasi': 'bg-gray-100 text-gray-600',
    'Hiburan': 'bg-gray-100 text-gray-600',
    'Kebutuhan': 'bg-gray-100 text-gray-600',
    'Dana Darurat': 'bg-gray-100 text-gray-600',
};

// --- Komponen Area Chart Tren ---
const TrendAreaChart = ({ period, data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    
    // Default fallback data if API hasn't loaded or has no data
    const chartData = data || {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        pemasukan: [0, 0, 0, 0, 0, 0, 0],
        pengeluaran: [0, 0, 0, 0, 0, 0, 0]
    };

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Pemasukan',
                        data: chartData.pemasukan,
                        borderColor: '#408A71',
                        backgroundColor: 'rgba(64,138,113,0.08)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#408A71',
                        borderWidth: 2,
                    },
                    {
                        label: 'Pengeluaran',
                        data: chartData.pengeluaran,
                        borderColor: '#FF8A8A',
                        backgroundColor: 'rgba(255,138,138,0.07)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#FF8A8A',
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#091413',
                        titleFont: { family: 'Figtree', size: 12 },
                        bodyFont: { family: 'Figtree', size: 12 },
                        callbacks: {
                            label: (ctx) => ` Rp ${ctx.raw.toLocaleString('id-ID')}`,
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11, family: 'Figtree' },
                            color: '#9CA3AF',
                            maxTicksLimit: 4,
                            callback: (val) => `${(val / 1000000).toFixed(1)}jt`,
                        },
                        border: { display: false },
                        grid: { color: 'rgba(0,0,0,0.04)' },
                    },
                    x: {
                        grid: { display: false },
                        border: { color: '#E5E7EB' },
                        ticks: { font: { size: 11, family: 'Figtree' }, color: '#6B7280' },
                    }
                }
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [period, data]);

    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-6 ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] hover:ring-gray-950/10 transition duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[16px] font-semibold text-secondary">Tren Arus Kas</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Perbandingan pemasukan dan pengeluaran</p>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-[3px] bg-[#408A71] inline-block rounded-full"></span> Pemasukan
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-[3px] bg-[#FF8A8A] inline-block rounded-full"></span> Pengeluaran
                    </span>
                </div>
            </div>
            <div className="w-full h-[240px] relative">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

// --- Komponen Statistik Kategori (Segmented Horizontal Bar) ---
const CategoryStatsCard = ({ data = [], totalAmount = 0 }) => {
    const COLORS = ['#408A71', '#639E88', '#8093F1', '#FF8A8A', '#FBB040'];
    
    const displayData = data.length > 0 ? data.map((d, i) => ({
        ...d,
        color: COLORS[i % COLORS.length]
    })) : [
        { label: 'Belum ada data', value: 100, color: '#f3f4f6', amount: 0 }
    ];

    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-6 ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] hover:ring-gray-950/10 transition duration-300 flex flex-col xl:col-span-2">
            <div className="mb-6">
                <h2 className="text-[16px] font-semibold text-secondary">Pengeluaran per Kategori</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">Distribusi pengeluaran berdasarkan pos anggaran</p>
            </div>

            {/* Segmented Horizontal Bar */}
            <div className="w-full h-5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 flex mb-8 outline outline-offset-2 outline-gray-50">
                {displayData.map((cat, i) => (
                    <div
                        key={i}
                        className="h-full transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full hover:brightness-95 cursor-help"
                        style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                        title={`${cat.label}: ${cat.value}%`}
                    ></div>
                ))}
            </div>

            {/* Detailed Legend Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 flex-grow content-start">
                {displayData.map((cat, i) => (
                    <div key={i} className="flex flex-col gap-1.5 group">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-offset-0 transition-all" style={{ backgroundColor: cat.color }}></span>
                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">
                                {cat.label} <span className="text-gray-300 mx-1">•</span> {cat.value}%
                            </span>
                        </div>
                        <div className="text-[15px] font-bold text-secondary group-hover:translate-x-1 transition-transform">
                            Rp {(cat.amount || 0).toLocaleString('id-ID')}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

// --- Komponen Monthly Bar Chart ---
const MonthlyBarChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    
    const chartData = data || { labels: ['Belum ada data'], data: [0] };
    
    // Calculate values for header
    const avg = chartData.data.length > 0 ? chartData.data.reduce((a, b) => a + b, 0) / chartData.data.length : 0;
    let highestMonth = 'N/A';
    if (chartData.data.length > 0) {
        const maxVal = Math.max(...chartData.data);
        const idx = chartData.data.indexOf(maxVal);
        highestMonth = chartData.labels[idx];
    }

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Pengeluaran',
                    data: chartData.data,
                    backgroundColor: '#639E88',
                    borderRadius: 6,
                    barThickness: 28,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            display: true,
                            font: { size: 10, family: 'Figtree' },
                            color: '#9CA3AF',
                            maxTicksLimit: 4,
                            callback: (val) => val === 0 ? '0' : (val >= 1000000 ? `${(val / 1000000).toFixed(0)}jt` : `${(val / 1000).toFixed(0)}rb`),
                        },
                        border: { display: false },
                        grid: { display: false },
                    },
                    x: {
                        grid: { display: false },
                        border: { color: '#E5E7EB' },
                        ticks: { font: { size: 11, family: 'Figtree' }, color: '#6B7280' },
                    }
                }
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [data]);

    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-6 ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] hover:ring-gray-950/10 transition duration-300 flex flex-col xl:col-span-3">
            <div className="mb-6 flex flex-col gap-5">
                <div>
                    <h2 className="text-[16px] font-semibold text-secondary">Perbandingan Bulanan</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Total pengeluaran Anda beberapa bulan terakhir</p>
                </div>

                {/* Summary Info */}
                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <span className="text-[20px] font-bold text-secondary">Rp {avg.toLocaleString('id-ID')}</span>
                        <span className="text-[11px] text-secondary/60 font-bold uppercase tracking-wider">Rata-rata / Bulan</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[20px] font-bold text-primary">{highestMonth}</span>
                        </div>
                        <span className="text-[11px] text-primary/60 font-bold uppercase tracking-wider">Bulan Tertinggi</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow w-full h-[200px] relative">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

// --- Halaman Utama Laporan ---
const Laporan = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('laporan', 400);
    const [fetchLaporan, { data: reportData, loading }] = useApi();
    
    const [activePeriod, setActivePeriod] = useState('Bulan Ini');

    // State untuk filter bulan dan tahun (Default sekarang)
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const loadData = async () => {
        try {
            await fetchLaporan('GET', `/laporan?bulan=${month}&tahun=${year}&periode=${activePeriod}`);
        } catch (err) {
            if (err.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchLaporan, month, year, activePeriod, navigate]);

    const stats = reportData?.data || {
        total_pemasukan: 0,
        total_pengeluaran: 0,
        total_tabungan: 0,
        saldo_bersih: 0,
        saving_rate: 0,
        per_kategori: [],
        transaksi_terbesar: [],
        trend: null,
        comparison: null
    };

    const formatIDR = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    const tableColumns = [
        { label: 'Deskripsi', key: 'nama_transaksi' },
        {
            label: 'Kategori', key: 'nama_kategori',
            render: (val) => (
                <span className="text-[13px] font-medium text-gray-500">
                    {val}
                </span>
            ),
            hideOnMobile: true,
        },
        { label: 'Tanggal', key: 'tanggal', align: 'center', className: 'text-gray-500', hideOnMobile: true },
        {
            label: 'Jumlah', key: 'jumlah', align: 'right',
            render: (val) => <span className="font-semibold text-secondary">Rp {formatIDR(val)}</span>
        },
    ];

    if (isFirstLoad || !reportData) {
        return <LaporanSkeleton />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-8 py-8 flex-shrink-0 gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Laporan</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Analisis mendalam pola keuangan dan arus kas anda
                    </p>
                </div>

                {/* Tombol Export */}
                <div className="flex items-center gap-3">
                    <Button size="md" variant="primary" icon={<FilePdfIcon size={18} weight="bold" />}>
                        Export PDF
                    </Button>
                    <Button size="md" variant="secondary" icon={<FileXlsIcon size={18} weight="bold" />}>
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Konten Utama */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">

                {/* Filter Periode */}
                <div className="self-center flex items-center gap-2 p-1 bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-fit">
                    {PERIODS.map(period => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${activePeriod === period
                                    ? 'bg-secondary text-white shadow-sm'
                                    : 'text-gray-500 hover:text-secondary hover:bg-gray-50'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard title="Total Pemasukan" amount={formatIDR(stats.total_pemasukan)} />
                    <SummaryCard title="Total Pengeluaran" amount={formatIDR(stats.total_pengeluaran)} />
                    <SummaryCard title="Total Tabungan" amount={formatIDR(stats.total_tabungan)} />
                    <SummaryCard title="Tingkat Tabungan" amount={stats.saving_rate} showRp={false} suffix="%" />
                </div>

                {reportData && !(stats.total_pemasukan > 0 || stats.total_pengeluaran > 0 || stats.per_kategori?.length > 0) ? (
                    <div className="bg-white rounded-xl ring-1 ring-gray-950/5 p-12">
                        <EmptyState 
                            title="Tidak Ada Data Laporan untuk Periode Ini"
                            description="Sepertinya belum ada aktivitas keuangan yang tercatat pada rentang waktu yang Anda pilih."
                            buttonText="Kembali ke Dashboard"
                            onButtonClick={() => navigate('/')}
                            className="py-10"
                        />
                    </div>
                ) : (
                    <>
                        {/* Area Chart Tren Arus Kas — Full Width */}
                        <TrendAreaChart period={activePeriod} data={stats.trend} />

                        {/* Dua Grafik Side by Side */}
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                            <MonthlyBarChart data={stats.comparison} />
                            <CategoryStatsCard data={stats.per_kategori} totalAmount={stats.total_pengeluaran} />
                        </div>

                        {/* Tabel Top Pengeluaran */}
                        <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-white">
                                <h2 className="text-[15px] font-semibold text-secondary">Top Pengeluaran</h2>
                                <p className="text-[12px] text-gray-400 mt-0.5">5 transaksi dengan nominal terbesar di periode ini</p>
                            </div>
                            <Table columns={tableColumns} data={stats.transaksi_terbesar} />
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default Laporan;
