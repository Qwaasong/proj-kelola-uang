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
        <div className="flex justify-between items-center mb-6">
            <Skeleton width={130} height={20} borderRadius={6} />
            <Skeleton width={100} height={34} borderRadius={8} />
        </div>
        <Skeleton height={290} borderRadius={10} />
        <div className="flex justify-end mt-4">
            <Skeleton width={80} height={14} borderRadius={6} />
        </div>
    </div>
);

/**
 * Komponen DashboardSkeleton — placeholder layout konten Dashboard.
 * Sidebar tidak disertakan karena sudah dikelola oleh App.jsx (Persistent).
 */
const DashboardSkeleton = () => (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#FAFAFA">
        <div className="flex flex-col h-full overflow-y-auto">

            {/* Header Skeleton */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
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
    </SkeletonTheme>
);

export default DashboardSkeleton;
