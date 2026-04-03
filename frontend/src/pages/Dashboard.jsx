import SummaryCard from '../components/SummaryCard';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import Button from '../components/Button';
import DashboardSkeleton from '../components/DashboardSkeleton';
import useFirstLoad from '../hooks/useFirstLoad';

// Data ringkasan keuangan
const summaryData = [
    { title: 'Pemasukan', amount: '120.000' },
    { title: 'Pengeluaran', amount: '786.000' },
    { title: 'Dana Darurat', amount: '567.000' },
    { title: 'Total Saldo', amount: '23.568.000' },
];

/**
 * Halaman Dashboard utama aplikasi Laeva.
 * Sidebar dan layout utama dikelola oleh App.jsx.
 */
const Dashboard = () => {
    // Skeleton hanya tampil sekali per sesi browser
    const isLoading = useFirstLoad('dashboard', 250);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            {/* Header / Kontrol Ringkasan */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-8 py-8 gap-4 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Dashboard</h1>
                    <p className="text-sm text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] sm:max-w-none">
                        Ringkasan aktivitas keuangan dan statistik aset anda
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <Button size="md">Tambah Transaksi</Button>
                    <Button size="md" variant="secondary">Transfer Dana</Button>
                </div>
            </div>

            {/* Konten Grid */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">

                {/* Kartu Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryData.map((card) => (
                        <SummaryCard
                            key={card.title}
                            title={card.title}
                            amount={card.amount}
                        />
                    ))}
                </div>

                {/* Grafik */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <BarChart />
                    <LineChart />
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;
