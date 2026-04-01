import SummaryCard from '../components/SummaryCard';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
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
        <>
            {/* Header Halaman */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <h1 className="text-2xl font-semibold text-secondary">Dashboard</h1>
                <div className="flex gap-3">
                    <button className="bg-primary text-white text-[13px] px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm">
                        Tambah Transaksi
                    </button>
                    <button className="bg-secondary text-white text-[13px] px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm">
                        Transfer Dana
                    </button>
                </div>
            </div>

            {/* Konten Grid */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full max-w-[1400px]">

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
                <div className="flex flex-col xl:flex-row gap-6 items-stretch">
                    <BarChart />
                    <LineChart />
                </div>
                
            </div>
        </>
    );
};

export default Dashboard;
