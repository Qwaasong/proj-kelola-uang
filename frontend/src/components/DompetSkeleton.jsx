import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton untuk satu kartu dompet.
 */
const WalletCardSkeleton = () => (
    <div className="bg-white py-5 px-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full flex flex-col justify-between">
        <div className="mb-5">
            <Skeleton width={90} height={14} borderRadius={6} className="mb-2" />
            <Skeleton width={150} height={30} borderRadius={6} />
        </div>
        <div className="flex gap-3">
            <Skeleton height={34} borderRadius={8} containerClassName="flex-1" />
            <Skeleton height={34} borderRadius={8} containerClassName="flex-1" />
        </div>
    </div>
);

/**
 * Komponen DompetSkeleton — placeholder layout konten Dompet.
 * Sidebar tidak disertakan karena sudah dikelola oleh App.jsx (Persistent).
 */
const DompetSkeleton = () => (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#FAFAFA">
        <div className="flex flex-col h-full overflow-y-auto">

            {/* Header Skeleton */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <Skeleton width={100} height={28} borderRadius={8} />
                <Skeleton width={140} height={38} borderRadius={8} />
            </div>

            {/* Grid Kartu Skeleton */}
            <div className="px-8 pb-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-[750px]">
                    <WalletCardSkeleton />
                    <WalletCardSkeleton />
                </div>
            </div>

        </div>
    </SkeletonTheme>
);

export default DompetSkeleton;
