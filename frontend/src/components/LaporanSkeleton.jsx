import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton untuk kartu ringkasan (SummaryCard).
 */
const SummaryCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] w-full">
        <Skeleton width={100} height={14} borderRadius={6} className="mb-3" />
        <Skeleton width={160} height={32} borderRadius={6} />
    </div>
);

/**
 * Skeleton untuk Chart Tren (Full Width).
 */
const TrendChartSkeleton = () => (
    <div className="bg-white p-6 rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] w-full">
        <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
                <Skeleton width={120} height={20} borderRadius={6} />
                <Skeleton width={200} height={14} borderRadius={6} />
            </div>
            <div className="flex gap-4">
                <Skeleton width={80} height={14} borderRadius={6} />
                <Skeleton width={80} height={14} borderRadius={6} />
            </div>
        </div>
        <Skeleton height={240} borderRadius={10} />
    </div>
);

/**
 * Skeleton untuk Monthly Bar Chart.
 */
const MonthlyChartSkeleton = () => (
    <div className="bg-white p-6 rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col h-full">
        <div className="mb-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <Skeleton width={160} height={20} borderRadius={6} />
                <Skeleton width={240} height={14} borderRadius={6} />
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col gap-2">
                    <Skeleton width={100} height={24} borderRadius={6} />
                    <Skeleton width={80} height={12} borderRadius={6} />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton width={80} height={24} borderRadius={6} />
                    <Skeleton width={100} height={12} borderRadius={6} />
                </div>
            </div>
        </div>
        <Skeleton height={200} borderRadius={10} />
    </div>
);

/**
 * Skeleton untuk Kategori Stats.
 */
const CategoryStatsSkeleton = () => (
    <div className="bg-white p-6 rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col h-full">
        <div className="mb-6 flex flex-col gap-2">
            <Skeleton width={180} height={20} borderRadius={6} />
            <Skeleton width={220} height={14} borderRadius={6} />
        </div>
        <Skeleton height={20} borderRadius={10} className="mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <Skeleton width={120} height={14} borderRadius={6} />
                    <Skeleton width={100} height={20} borderRadius={6} />
                </div>
            ))}
        </div>
    </div>
);

/**
 * Skeleton untuk Tabel.
 */
const TableSkeleton = () => (
    <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
            <Skeleton width={140} height={20} borderRadius={6} />
            <Skeleton width={240} height={14} borderRadius={6} className="mt-1" />
        </div>
        <div className="p-6 flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <Skeleton width="30%" height={16} borderRadius={6} />
                    <Skeleton width="15%" height={16} borderRadius={6} />
                    <Skeleton width="15%" height={16} borderRadius={6} />
                    <Skeleton width="20%" height={16} borderRadius={6} />
                </div>
            ))}
        </div>
    </div>
);

const LaporanSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#F3F4F6" highlightColor="#F9FAFB">
            <div className="flex flex-col h-full overflow-y-auto w-full">
                {/* Header Skeleton */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-8 py-8 flex-shrink-0 gap-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton width={140} height={32} borderRadius={8} />
                        <Skeleton width={300} height={16} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton width={120} height={40} borderRadius={10} />
                        <Skeleton width={120} height={40} borderRadius={10} />
                    </div>
                </div>

                <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                    {/* Period Filter Skeleton */}
                    <div className="self-center">
                        <Skeleton width={320} height={44} borderRadius={12} />
                    </div>

                    {/* Summary Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SummaryCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Trend Chart Skeleton */}
                    <TrendChartSkeleton />

                    {/* Side by Side Charts Skeleton */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-3">
                            <MonthlyChartSkeleton />
                        </div>
                        <div className="xl:col-span-2">
                            <CategoryStatsSkeleton />
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <TableSkeleton />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default LaporanSkeleton;
