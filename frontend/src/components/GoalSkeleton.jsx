import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton untuk satu kartu ringkasan keuangan (SummaryCard).
 */
const SummaryCardSkeleton = () => (
    <div className="
        relative overflow-hidden rounded-xl bg-white p-6 
        ring-1 ring-gray-950/5 
        shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
    ">
        <div className="flex flex-col gap-y-2">
            <Skeleton width={80} height={14} borderRadius={6} />
            <div className="flex items-baseline gap-1 mt-1">
                <Skeleton width={140} height={32} borderRadius={6} />
            </div>
        </div>
    </div>
);

/**
 * Skeleton untuk baris tabel Goal.
 */
const TableRowSkeleton = () => (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FAFAFA]/50 transition-colors">
        <td className="py-4 px-6">
            <Skeleton width={150} height={16} borderRadius={4} />
        </td>
        <td className="py-4 px-6">
            <Skeleton width={100} height={16} borderRadius={4} />
        </td>
        <td className="py-4 px-6">
            <Skeleton width={100} height={16} borderRadius={4} />
        </td>
        <td className="py-4 px-6 text-right">
            <div className="flex justify-end">
                <Skeleton width={60} height={16} borderRadius={4} />
            </div>
        </td>
    </tr>
);

/**
 * Komponen GoalSkeleton — placeholder layout konten Halaman Goal.
 */
const GoalSkeleton = () => (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#FAFAFA">
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            {/* Header Skeleton */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-2">
                    <Skeleton width={180} height={28} borderRadius={8} />
                    <Skeleton width={320} height={16} borderRadius={6} />
                </div>
                <Skeleton width={160} height={42} borderRadius={8} />
            </div>

            {/* Konten Utama Skeleton */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                
                {/* Summary Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SummaryCardSkeleton key={i} />
                    ))}
                </div>

                {/* Table Container Skeleton (Filament Style) */}
                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
                    
                    {/* Header Tabel Box Skeleton */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <Skeleton width={100} height={18} borderRadius={4} />
                    </div>

                    {/* Area Tabel Skeleton */}
                    <div className="w-full overflow-x-auto text-left">
                        <table className="w-full min-w-[700px] text-sm">
                            <thead className="bg-[#FAFAFA] border-b border-gray-100">
                                <tr>
                                    <th className="py-3 px-6 font-semibold text-secondary w-[40%] text-left">
                                        <Skeleton width={80} height={12} />
                                    </th>
                                    <th className="py-3 px-6 font-semibold text-secondary text-left">
                                        <Skeleton width={60} height={12} />
                                    </th>
                                    <th className="py-3 px-6 font-semibold text-secondary text-left">
                                        <Skeleton width={80} height={12} />
                                    </th>
                                    <th className="py-3 px-6 font-semibold text-secondary text-right">
                                        <div className="flex justify-end">
                                            <Skeleton width={100} height={12} />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Tabel Skeleton */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-t border-gray-100 gap-4 bg-[#FAFAFA]/50">
                        <Skeleton width={180} height={14} borderRadius={4} />

                        <div className="flex items-center gap-1.5 text-right">
                            <Skeleton width={32} height={32} borderRadius={8} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </SkeletonTheme>
);

export default GoalSkeleton;
