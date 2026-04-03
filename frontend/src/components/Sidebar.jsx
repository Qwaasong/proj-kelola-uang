import { Link, useLocation } from 'react-router-dom';
import {
    HouseIcon,      
    WalletIcon,     
    ArrowsLeftRightIcon, 
    StackIcon,      
    FileTextIcon,      
    FlagIcon,      
    QuestionIcon,       
    SignOutIcon,  
    CaretLeftIcon,     
    CaretRightIcon,  
} from '@phosphor-icons/react';

const mainMenus = [
    { id: 1, name: 'Dashboard', icon: HouseIcon, path: '/dashboard' },
    { id: 2, name: 'Dompet', icon: WalletIcon, path: '/dompet' },
    { id: 3, name: 'Transaksi', icon: ArrowsLeftRightIcon, path: '/transaksi' },
    { id: 4, name: 'Dana Darurat', icon: StackIcon, path: '/dana-darurat' },
    { id: 8, name: 'Goal', icon: FlagIcon, path: '/goal' },
    { id: 5, name: 'Laporan', icon: FileTextIcon, path: '/laporan' },
];


const footerMenus = [
    { id: 6, name: 'Help', icon: QuestionIcon, colorClass: 'text-gray-500 hover:text-secondary', path: '/help' },
    { id: 7, name: 'Logout Account', icon: SignOutIcon, colorClass: 'text-[#E74C3C] hover:text-[#c0392b]', path: '/login' },
];

/**
 * Komponen Sidebar navigasi utama dashboard.
 * Props:
 * - isOpen: boolean — apakah sidebar terbuka atau collapsed
 * - toggleSidebar: fn — fungsi untuk toggle sidebar
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    return (
        <div
            className={`bg-white h-screen border-r border-gray-300 flex flex-col flex-shrink-0 relative transition-all duration-300 ease-in-out z-20 ${
                isOpen ? 'w-[260px]' : 'w-[88px]'
            }`}
        >
            {/* Tombol Collapse */}
            <div
                onClick={toggleSidebar}
                className="absolute -right-3.5 top-8 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition-colors z-30"
            >
                {isOpen ? (
                    <CaretLeftIcon size={14} weight="bold" className="text-gray-400" />
                ) : (
                    <CaretRightIcon size={14} weight="bold" className="text-gray-400" />
                )}
            </div>

            {/* Logo Container */}
            <div
            className={`relative flex items-center h-[88px] transition-all duration-300 ease-in-out ${
                isOpen ? 'px-8' : 'px-[29px]'
            }`}
            >
            <div className="flex items-center overflow-hidden">
                {/* Icon */}
                <div className="flex-shrink-0">
                <svg width="30" height="30" viewBox="0 0 80 75" fill="none">
                    <rect width="20" height="50" fill="black" />
                    <rect x="25" y="25" width="20" height="50" fill="black" />
                    <rect x="75" width="20" height="50" transform="rotate(90 75 0)" fill="black" />
                </svg>
                </div>

                {/* Efek Terpotong/Sliding */}
                <div
                className={`transition-all duration-300 ease-in-out ${
                    isOpen 
                    ? 'ml-3 opacity-100 max-w-[150px]' 
                    : 'ml-0 opacity-0 max-w-0'
                }`}
                style={{ overflow: 'hidden' }}
                >
                <svg width="130" height="30" viewBox="0 0 404 90" fill="none">
                    <path d="M-1.23978e-05 89.6V0H16.64V74.24H57.984V89.6H-1.23978e-05ZM67.016 89.6L101.96 0H117.576L152.264 89.6H134.984L115.784 38.656C115.357 37.632 114.76 36.0107 113.992 33.792C113.309 31.5733 112.541 29.184 111.688 26.624C110.835 23.9787 110.067 21.5467 109.384 19.328C108.701 17.024 108.189 15.36 107.848 14.336L111.048 14.208C110.536 15.9147 109.939 17.8347 109.256 19.968C108.573 22.1013 107.848 24.32 107.08 26.624C106.312 28.928 105.544 31.1467 104.776 33.28C104.093 35.4133 103.453 37.3333 102.856 39.04L83.656 89.6H67.016ZM82.888 69.12L88.648 54.656H129.48L135.624 69.12H82.888ZM166.375 89.6V0H224.999V15.104H182.759V74.496H225.511V89.6H166.375ZM174.055 51.2V36.352H218.471V51.2H174.055ZM272.359 89.6L236.519 0H254.695L274.663 51.328C275.687 53.9733 276.583 56.3627 277.351 58.496C278.119 60.544 278.802 62.4213 279.399 64.128C279.996 65.8347 280.508 67.4987 280.935 69.12C281.447 70.7413 282.002 72.448 282.599 74.24H279.015C279.612 71.936 280.252 69.6747 280.935 67.456C281.618 65.152 282.386 62.72 283.239 60.16C284.178 57.6 285.287 54.656 286.567 51.328L305.255 0H323.559L287.463 89.6H272.359ZM318.141 89.6L353.085 0H368.701L403.389 89.6H386.109L366.909 38.656C366.482 37.632 365.885 36.0107 365.117 33.792C364.434 31.5733 363.666 29.184 362.813 26.624C361.96 23.9787 361.192 21.5467 360.509 19.328C359.826 17.024 359.314 15.36 358.973 14.336L362.173 14.208C361.661 15.9147 361.064 17.8347 360.381 19.968C359.698 22.1013 358.973 24.32 358.205 26.624C357.437 28.928 356.669 31.1467 355.901 33.28C355.218 35.4133 354.578 37.3333 353.981 39.04L334.781 89.6H318.141ZM334.013 69.12L339.773 54.656H380.605L386.749 69.12H334.013Z" fill="black"/>
                </svg>
                </div>
            </div>
            </div>

            {/* Divider */}
            <div className="px-6 w-full mb-6">
                <hr className="border-gray-100" />
            </div>

            {/* Menu Utama */}
            <div className="flex flex-col flex-grow">
                <div className="mb-2 overflow-hidden">
                    <div className="px-8 text-left">
                        <p
                            className={`font-light text-gray-500 uppercase tracking-widest text-[11px] transition-transform duration-300 ${
                                isOpen ? 'translate-x-0' : '-translate-x-[6px]'
                            }`}
                        >
                            MAIN
                        </p>
                    </div>
                </div>

                <ul className="space-y-2 flex flex-col items-center w-full px-4">
                    {mainMenus.map((menu) => {
                        const isActive = location.pathname === menu.path;
                        const IconComponent = menu.icon;
                        return (
                            <li key={menu.id} className="w-full">
                                <Link
                                    to={menu.path}
                                    className={`group relative flex items-center h-12 w-full rounded-xl cursor-pointer transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-[#F0F7F4] text-primary font-semibold'
                                            : 'text-gray-500 hover:text-secondary hover:bg-gray-50'
                                    }`}
                                >
                                    {/* Ikon */}
                                    <div className="w-[56px] h-full flex items-center justify-center flex-shrink-0">
                                        <IconComponent size={22} weight={isActive ? 'fill' : 'regular'} />
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={`text-[14px] whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                            isOpen ? 'w-full opacity-100' : 'w-0 opacity-0'
                                        }`}
                                    >
                                        {menu.name}
                                    </span>

                                    {/* Tooltip saat sidebar collapsed */}
                                    {!isOpen && (
                                        <div className="absolute left-[70px] bg-secondary text-white text-[12px] px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-md z-50">
                                            {menu.name}
                                            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary rotate-45"></div>
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Footer Menu */}
            <div className="pb-8 space-y-2 flex flex-col items-center w-full px-4">
                {footerMenus.map((menu) => {
                    const IconComponent = menu.icon;
                    return (
                        <Link
                            key={menu.id}
                            to={menu.path}
                            className={`group relative flex items-center h-12 w-full rounded-xl cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${menu.colorClass}`}
                        >
                            <div className="w-[56px] h-full flex items-center justify-center flex-shrink-0">
                                <IconComponent size={22} />
                            </div>
                            <span
                                className={`text-[14px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                    isOpen ? 'w-full opacity-100' : 'w-0 opacity-0'
                                }`}
                            >
                                {menu.name}
                            </span>
                            {!isOpen && (
                                <div className="absolute left-[70px] bg-secondary text-white text-[12px] px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-md z-50">
                                    {menu.name}
                                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary rotate-45"></div>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
