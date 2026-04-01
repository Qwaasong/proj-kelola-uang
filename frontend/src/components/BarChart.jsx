import { useEffect, useRef } from 'react';
import { Info } from '@phosphor-icons/react';
import Chart from 'chart.js/auto';

/**
 * Komponen BarChart — Distribusi Dana berdasarkan kategori.
 * Menggunakan Chart.js dengan lifecycle cleanup untuk mencegah memory leak.
 */
const BarChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Makan & Minum', 'Transportasi', 'Dana Darurat', 'Goal', 'Langganan'],
                datasets: [{
                    label: 'Semua Dana',
                    data: [35, 88, 93, 80, 58],
                    backgroundColor: '#639E88',
                    borderRadius: 6,
                    barThickness: 45,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20, font: { size: 11, family: 'Figtree' }, color: '#9CA3AF' },
                        border: { display: false },
                        grid: { color: 'transparent' }
                    },
                    x: {
                        grid: { display: false },
                        border: { color: '#E5E7EB' },
                        ticks: { font: { size: 11, family: 'Figtree' }, color: '#6B7280' }
                    }
                }
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, []);

    return (
        <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full lg:w-[60%] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold">Distribusi Dana</h2>
                    <Info size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <button className="bg-secondary text-white text-[12px] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
                    Lihat Laporan
                </button>
            </div>
            <div className="flex-grow w-full h-[250px] relative">
                <canvas ref={chartRef}></canvas>
            </div>
            <div className="flex justify-end mt-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                    <span className="w-3 h-3 bg-[#639E88] inline-block rounded-sm"></span> Semua Dana
                </div>
            </div>
        </div>
    );
};

export default BarChart;
