import { useEffect, useRef } from 'react';
import { InfoIcon } from '@phosphor-icons/react';
import Chart from 'chart.js/auto';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

/**
 * Komponen BarChart — Distribusi Dana berdasarkan kategori.
 * Menggunakan Chart.js dengan lifecycle cleanup untuk mencegah memory leak.
 */
const BarChart = ({ data = [] }) => {
    const navigate = useNavigate();
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const labels = data.length > 0 ? data.map(item => item.nama_kategori) : ['Belum ada data'];
    const values = data.length > 0 ? data.map(item => item.total) : [0];

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Semua Dana',
                    data: values,
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
        <div className="relative overflow-hidden rounded-xl bg-white p-6 ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] dark:bg-gray-900 dark:ring-white/10 dark:shadow-none transition duration-300 hover:ring-gray-950/10 w-full xl:col-span-3 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold">Distribusi Dana</h2>
                    <InfoIcon size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <Button size="sm" variant="secondary" onClick={() => navigate('/laporan')}>Lihat Laporan</Button>
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
