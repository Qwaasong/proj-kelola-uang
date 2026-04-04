import { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import Button from '../components/Button';
import DashboardSkeleton from '../components/DashboardSkeleton';
import useFirstLoad from '../hooks/useFirstLoad';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

/**
 * Halaman Dashboard utama aplikasi Laeva.
 * Menghubungkan data ringkasan keuangan ke API.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('dashboard', 250);
    const [fetchDashboard, { data, loading, error }] = useApi();
    const [summary, setSummary] = useState([
        { title: 'Pemasukan', amount: '0' },
        { title: 'Pengeluaran', amount: '0' },
        { title: 'Dana Darurat', amount: '0' },
        { title: 'Total Saldo', amount: '0' },
    ]);

    // Format number to IDR string
    const formatIDR = (num) => {
        return new Intl.NumberFormat('id-ID').format(num || 0);
    };

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await fetchDashboard('GET', '/dashboard');
                if (response && response.data) {
                    const d = response.data;
                    setSummary([
                        { title: 'Pemasukan', amount: formatIDR(d.pemasukan_bulanan) },
                        { title: 'Pengeluaran', amount: formatIDR(d.pengeluaran_bulanan) },
                        { title: 'Dana Darurat', amount: formatIDR(d.dana_darurat?.terkumpul) },
                        { title: 'Total Saldo', amount: formatIDR(d.total_saldo) },
                    ]);
                }
            } catch (err) {
                if (err.status === 401) {
                    navigate('/login');
                }
                console.error("Gagal memuat dashboard:", err);
            }
        };

        loadDashboard();
    }, [fetchDashboard, navigate]);

    if (isFirstLoad || loading) {
        return <DashboardSkeleton />;
    }

    if (error && !data) {
        return <div className="p-8 text-red-500 font-medium">Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">

            {/* Header / Kontrol Ringkasan */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-8 py-8 gap-4 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Dashboard</h1>
                    <p className="text-sm text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] sm:max-w-none">
                        Halo, selamat datang kembali! Ringkasan aktivitas keuangan Anda.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <Button size="md" onClick={() => navigate('/transaksi')}>Tambah Transaksi</Button>
                    <Button size="md" variant="secondary" onClick={() => navigate('/dompet')}>Transfer Dana</Button>
                </div>
            </div>

            {/* Konten Grid */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">

                {/* Kartu Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summary.map((card) => (
                        <SummaryCard
                            key={card.title}
                            title={card.title}
                            amount={card.amount}
                        />
                    ))}
                </div>

                {/* Grafik */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <BarChart data={data?.data?.distribusi_kategori} />
                    <LineChart trendData={data?.data?.grafik_waktu} todayData={data?.data?.transaksi_hari_ini} />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
