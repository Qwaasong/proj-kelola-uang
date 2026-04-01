import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Komponen SidebarSkeleton — placeholder sidebar saat pertama kali halaman dimuat.
 * Digunakan bersama oleh DashboardSkeleton dan DompetSkeleton.
 */
const SidebarSkeleton = () => (
    <div className="bg-white h-screen border-r border-gray-100 flex flex-col flex-shrink-0 w-[260px]">
        {/* Logo */}
        <div className="flex items-center px-8 pt-8 pb-6 h-[88px]">
            <Skeleton width={120} height={28} borderRadius={6} />
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

export default SidebarSkeleton;
