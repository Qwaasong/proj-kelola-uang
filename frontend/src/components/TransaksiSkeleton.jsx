import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton untuk toolbar tabel (Filter, Search).
 */
const TableToolbarSkeleton = () => (
    <div className="flex justify-between items-center px-5 py-3 border-b border-borderLight flex-wrap gap-4 bg-white rounded-t-2xl">
        <div className="flex items-center gap-3">
            <Skeleton width={32} height={32} borderRadius={6} />
        </div>
        <Skeleton width={320} height={36} borderRadius={8} />
    </div>
);

/**
 * Skeleton untuk baris tabel transaksi.
 */
const TableRowSkeleton = () => (
    <tr className="border-b border-borderLight last:border-0">
        <td className="py-3.5 pl-5 pr-2 w-[40px]">
            <Skeleton width={15} height={15} borderRadius={4} />
        </td>
        <td className="py-3.5 px-4 w-[60px]">
            <Skeleton width={20} height={14} />
        </td>
        <td className="py-3.5 px-6">
            <Skeleton width={100} height={14} />
        </td>
        <td className="py-3.5 px-6">
            <Skeleton width={80} height={14} />
        </td>
        <td className="py-3.5 px-6">
            <Skeleton width={120} height={14} />
        </td>
        <td className="py-3.5 px-6 text-gray-500">
            <Skeleton width={130} height={14} />
        </td>
        <td className="py-3.5 px-6 w-[50px]">
            <div className="flex justify-center">
                <Skeleton width={24} height={24} borderRadius={4} />
            </div>
        </td>
    </tr>
);

/**
 * Komponen TransaksiSkeleton — placeholder layout konten Transaksi.
 * Sidebar tidak disertakan karena sudah dikelola oleh App.jsx (Persistent).
 */
const TransaksiSkeleton = () => (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#FAFAFA">
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            {/* Header Skeleton */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <Skeleton width={140} height={28} borderRadius={8} />
                <Skeleton width={140} height={38} borderRadius={8} />
            </div>

            {/* Table Container Skeleton (Filament Style) */}
            <div className="px-8 pb-10 w-full max-w-[1450px]">
                <div className="
                    relative overflow-hidden bg-white rounded-xl 
                    ring-1 ring-gray-950/5 
                    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
                    flex flex-col w-full
                ">
                    
                    <TableToolbarSkeleton />

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left">
                            <thead className="bg-[#FAFAFA] border-b border-gray-100">
                                <tr>
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <th key={i} className="py-3 px-6">
                                            <Skeleton width={40} height={12} />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Pagination Skeleton */}
                    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 bg-[#FAFAFA]/50">
                        <Skeleton width={200} height={12} />
                        <div className="flex gap-1.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} width={28} height={28} borderRadius={4} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </SkeletonTheme>
);

export default TransaksiSkeleton;
