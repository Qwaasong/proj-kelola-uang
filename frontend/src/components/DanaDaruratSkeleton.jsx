import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton untuk kartu ringkasan.
 */
const SummaryCardSkeleton = () => (
    <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full">
        <Skeleton width={80} height={14} borderRadius={6} className="mb-3" />
        <Skeleton width={140} height={32} borderRadius={6} />
    </div>
);

/**
 * Komponen DanaDaruratSkeleton — placeholder layout konten Dana Darurat.
 */
const DanaDaruratSkeleton = () => (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#FAFAFA">
        <div className="flex flex-col h-full overflow-y-auto">

            {/* Header Skeleton */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-2">
                    <Skeleton width={200} height={28} borderRadius={8} />
                    <Skeleton width={300} height={16} borderRadius={6} />
                </div>
                <div className="flex gap-3">
                    <Skeleton width={140} height={38} borderRadius={8} />
                    <Skeleton width={180} height={38} borderRadius={8} />
                </div>
            </div>

            {/* Grid Konten Skeleton */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full max-w-[1400px]">

                {/* Summary Cards Skeleton (3 Cards for Emergency Fund) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <SummaryCardSkeleton key={i} />
                    ))}
                </div>

                {/* Table Placeholder */}
                <div className="bg-white rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 italic">
                        <Skeleton width={150} height={20} borderRadius={6} />
                    </div>
                    <div className="p-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                                <div className="flex flex-col gap-2">
                                    <Skeleton width={120} height={16} borderRadius={4} />
                                    <Skeleton width={80} height={12} borderRadius={4} />
                                </div>
                                <Skeleton width={100} height={20} borderRadius={6} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </SkeletonTheme>
);

export default DanaDaruratSkeleton;
