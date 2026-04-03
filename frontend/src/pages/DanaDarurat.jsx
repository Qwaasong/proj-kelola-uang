import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import { StackIcon } from '@phosphor-icons/react';
import useFirstLoad from '../hooks/useFirstLoad';
import DashboardSkeleton from '../components/DashboardSkeleton';

/**
 * Halaman Dana Darurat.
 * Menampilkan target, progres, dan log transaksi dana darurat.
 */
const DanaDarurat = () => {
    // Simulasi loading state agar konsisten dengan halaman lain
    const isLoading = useFirstLoad('danadarurat', 250);

    // Data Dummy Log Transaksi Dana Darurat
    const logData = [
        { id: 1, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 2, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 3, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 4, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 5, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
    ];

    // Konfigurasi kolom tabel
    const columns = [
        { label: 'Dompet', key: 'wallet' },
        { label: 'Jumlah', key: 'amount', render: (val) => `Rp ${val}` },
        { label: 'Tanggal', key: 'date', align: 'right', className: 'text-gray-500' },
    ];

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            {/* Header Halaman */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Dana Darurat</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Pantau progres dan kelola dana cadangan masa depan anda
                    </p>
                </div>
                <Button size="md" icon={<StackIcon size={18} weight="bold" />}>
                    Tambah Dana Darurat
                </Button>
            </div>

            {/* Konten Utama */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                
                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard title="Terkumpul" amount="120.000" />
                    <SummaryCard title="Target" amount="786.000" />
                    <SummaryCard title="Selisih" amount="567.000" />
                    <SummaryCard title="Jangka Waktu" amount="6" showRp={false} suffix="Bulan" />
                </div>

                {/* Tabel Log Transaksi (Filament Style Container) */}
                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
                    
                    {/* Header Tabel Box */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <h2 className="text-[15px] font-semibold text-secondary">Log Transaksi</h2>
                    </div>

                    {/* Area Tabel */}
                    <Table 
                        columns={columns}
                        data={logData}
                    />

                    {/* Footer Tabel (Pagination) */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-t border-gray-100 gap-4 bg-[#FAFAFA]/50">
                        <span className="text-[12px] text-gray-500 font-medium">
                            Menampilkan 1 - 5 dari 5 hasil
                        </span>

                        <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                                <span className="text-[10px]">1</span>
                            </Button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DanaDarurat;
