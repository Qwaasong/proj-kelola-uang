import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import DashboardSkeleton from '../components/DashboardSkeleton';

// Data ringkasan keuangan
const summaryData = [
    { title: 'Pemasukan', amount: '120.000' },
    { title: 'Pengeluaran', amount: '786.000' },
    { title: 'Dana Darurat', amount: '567.000' },
    { title: 'Total Saldo', amount: '23.568.000' },
];

/**
 * Halaman Dashboard utama aplikasi Laeva.
 * Menampilkan skeleton loading selama 250ms sebelum konten sesungguhnya muncul.
 */
const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State loading — true saat pertama kali komponen dimuat
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Tampilkan skeleton selama 250ms, lalu render konten sesungguhnya
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 250);

        // Cleanup timer saat komponen unmount
        return () => clearTimeout(timer);
    }, []);

    // Tampilkan skeleton saat loading
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex h-screen bg-[#F5F7F6] font-sans text-secondary antialiased">
            
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Konten Utama */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">

                {/* Header Halaman */}
                <div className="flex justify-between items-center px-8 py-8">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
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
            </div>
        </div>
    );
};

export default Dashboard;
