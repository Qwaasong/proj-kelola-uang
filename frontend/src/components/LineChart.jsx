import { useEffect, useRef } from 'react';
import Button from './Button';
import {
    InfoIcon,
    CalendarIcon,
    ArrowUpRightIcon,
    ArrowDownRightIcon
} from '@phosphor-icons/react';
import Chart from 'chart.js/auto';

// Data transaksi hari ini - fallback jika belum ada data
const mockTransactions = [
    { label: 'Makan dan Minum', amount: 0 },
    { label: 'Transportasi', amount: 0 },
    { label: 'Lainnya', amount: 0 },
];

/**
 * Komponen LineChart — Grafik area transaksi pemasukan dan pengeluaran hari ini.
 * Menggunakan Chart.js dengan gradient fill dan lifecycle cleanup.
 * @param {Array} trendData - Data dari grafik_waktu
 * @param {Object} todayData - Data dari transaksi_hari_ini
 */
const LineChart = ({ trendData = [], todayData = { Pemasukan: 0, Pengeluaran: 0, status: "" } }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const labels = trendData.length > 0 ? trendData.map(d => `Tgl ${d.hari}`) : ['12 AM', '8 AM', '4 PM', '8 PM'];
    const dataMasuk = trendData.length > 0 ? trendData.map(d => d.masuk) : [0, 0, 0, 0];
    const dataKeluar = trendData.length > 0 ? trendData.map(d => d.keluar) : [0, 0, 0, 0];

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');

        // Gradient Biru (Pemasukan)
        const gradBlue = ctx.createLinearGradient(0, 0, 0, 150);
        gradBlue.addColorStop(0, 'rgba(128, 147, 241, 0.2)');
        gradBlue.addColorStop(1, 'rgba(128, 147, 241, 0)');

        // Gradient Merah (Pengeluaran)
        const gradRed = ctx.createLinearGradient(0, 0, 0, 150);
        gradRed.addColorStop(0, 'rgba(255, 138, 138, 0.2)');
        gradRed.addColorStop(1, 'rgba(255, 138, 138, 0)');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Pengeluaran',
                        data: dataKeluar,
                        borderColor: '#FF8A8A',
                        backgroundColor: gradRed,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                    },
                    {
                        label: 'Pemasukan',
                        data: dataMasuk,
                        borderColor: '#8093F1',
                        backgroundColor: gradBlue,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 200,
                        ticks: { stepSize: 100, font: { size: 10, family: 'Figtree' }, color: '#9CA3AF' },
                        border: { display: false },
                        grid: { color: '#E5E7EB', tickLength: 0 }
                    },
                    x: {
                        grid: { color: '#E5E7EB', borderDash: [4, 4] },
                        border: { color: '#E5E7EB' },
                        ticks: { font: { size: 10, family: 'Figtree' }, color: '#6B7280', padding: 10 }
                    }
                }
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, []);

    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-6 ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] dark:bg-gray-900 dark:ring-white/10 dark:shadow-none transition duration-300 hover:ring-gray-950/10 w-full xl:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold">Transaksi Hari Ini</h2>
                    <InfoIcon size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <Button size="sm" variant="secondary">Detail</Button>
            </div>

            {/* Total Transaksi */}
            <div className="mb-5">
                <p className="text-[28px] font-semibold flex items-baseline gap-1">
                    <span className="text-sm text-gray-400 font-medium">Rp</span> {new Intl.NumberFormat('id-ID').format(todayData.Pemasukan - todayData.Pengeluaran)}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-1">{todayData.status || "Pencatatan hari ini"}</p>
            </div>

            {/* Daftar Kategori Transaksi - Berdasarkan data asli atau fallback mock */}
            <div className="space-y-3 mb-6 text-[13px] font-medium">
                {(todayData.detail && todayData.detail.length > 0 ? todayData.detail : mockTransactions).map((trx, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span className="text-gray-600">{trx.label}</span>
                        <span>Rp {new Intl.NumberFormat('id-ID').format(trx.amount)}</span>
                    </div>
                ))}
            </div>

            {/* Grafik */}
            <div className="flex-grow w-full h-[150px] relative mt-auto">
                <canvas ref={chartRef}></canvas>
            </div>

            {/* Legenda */}
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="w-4 h-[2px] bg-[#8093F1] inline-block"></span> Pemasukan
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="w-4 h-[2px] bg-[#FF8A8A] inline-block"></span> Pengeluaran
                </div>
            </div>
        </div>
    );
};

export default LineChart;
