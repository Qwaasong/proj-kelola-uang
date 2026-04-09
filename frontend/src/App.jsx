import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Loading from './components/Loading';
import { useGlobalLoading } from './context/LoadingContext';

/**
 * Komponen App (Main Layout)
 * Mengelola state global untuk Sidebar agar tetap terbuka/tertutup saat navigasi.
 */
const App = () => {
    const { isGlobalLoading } = useGlobalLoading();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading' || isGlobalLoading;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { pathname } = useLocation();

    // Scroll to Top & Reset UI on Navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    return (
        <div className="flex h-screen bg-[#F5F7F6] font-sans text-secondary antialiased overflow-hidden">
            
            {/* Unified Loading Indicator — Aktif saat navigasi rute ATAU fetching data API */}
            {isLoading && <Loading variant="progressbar" />}

            {/* Sidebar Bersifat Persistent — tidak di-render ulang saat pindah halaman */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Area Konten Utama (Outlet) — Animasi Fade-In */}
            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto scroll-smooth">
                <TopHeader />
                <main key={pathname} className="animate-page-fade">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default App;
