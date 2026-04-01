import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton untuk satu kartu ringkasan keuangan.
 */
const SummaryCardSkeleton = () => (
    <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full">
        <Skeleton width={80} height={14} borderRadius={6} className="mb-3" />
        <Skeleton width={140} height={32} borderRadius={6} />
    </div>
);

/**
 * Skeleton untuk kartu grafik (BarChart / LineChart).
 */
const ChartCardSkeleton = ({ widthClass = 'w-full' }) => (
    <div className={`bg-white p-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col ${widthClass}`}>
        {/* Header chart */}
        <div className="flex justify-between items-center mb-6">
            <Skeleton width={130} height={20} borderRadius={6} />
            <Skeleton width={100} height={34} borderRadius={8} />
        </div>
        {/* Body chart */}
        <Skeleton height={290} borderRadius={10} />
        {/* Legenda */}
        <div className="flex justify-end mt-4">
            <Skeleton width={80} height={14} borderRadius={6} />
        </div>
    </div>
);

/**
 * Skeleton untuk sidebar (versi collapsed).
 */
const SidebarSkeleton = () => (
    <div className="bg-white h-screen border-r border-gray-100 flex flex-col flex-shrink-0 w-[260px]">
        {/* Logo */}
        <div className="flex items-center px-8 pt-8 pb-6 h-[88px]">
            <Skeleton width={100} height={28} borderRadius={6} />
    </div>
        <div className="px-6 mb-6">
            <hr className="border-gray-100" />
        </div>
        {/* Label "MAIN" */}
        <div className="px-8 mb-2">
            <Skeleton width={40} height={12} borderRadius={4} />
        </div>
        {/* Menu item skeletons */}
        <div className="px-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={48} borderRadius={12} />
            ))}
        </div>
        {/* Footer menu */}
        <div className="mt-auto pb-8 px-4 space-y-2">
            <Skeleton height={48} borderRadius={12} />
            <Skeleton height={48} borderRadius={12} />
        </div>
    </div>
);

/**
 * Komponen DashboardSkeleton — ditampilkan selama 250ms saat pertama kali
 * halaman dashboard dimuat, sebelum konten sesungguhnya muncul.
 */
const DashboardSkeleton = () => (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#FAFAFA">
        <div className="flex h-screen bg-[#F5F7F6] font-sans antialiased">
            
            {/* Sidebar Skeleton */}
            <SidebarSkeleton />

            {/* Konten Utama Skeleton */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">

                {/* Header Skeleton */}
                <div className="flex justify-between items-center px-8 py-8">
                    <Skeleton width={140} height={28} borderRadius={8} />
                    <div className="flex gap-3">
                        <Skeleton width={140} height={38} borderRadius={8} />
                        <Skeleton width={120} height={38} borderRadius={8} />
                    </div>
                </div>

                {/* Grid Konten Skeleton */}
                <div className="px-8 pb-10 flex flex-col gap-6 w-full max-w-[1400px]">
                    
                    {/* Summary Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SummaryCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Chart Skeletons */}
                    <div className="flex flex-col xl:flex-row gap-6 items-stretch">
                        <ChartCardSkeleton widthClass="w-full lg:w-[60%]" />
                        <ChartCardSkeleton widthClass="w-full lg:w-[40%]" />
                    </div>

                </div>
            </div>
        </div>
    </SkeletonTheme>
);

export default DashboardSkeleton;
