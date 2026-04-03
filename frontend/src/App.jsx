import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';

/**
 * Komponen App (Main Layout)
 * Mengelola state global untuk Sidebar agar tetap terbuka/tertutup saat navigasi.
 */
const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    return (
        <div className="flex h-screen bg-[#F5F7F6] font-sans text-secondary antialiased overflow-hidden">
            
            {/* Sidebar Bersifat Persistent — tidak di-render ulang saat pindah halaman */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Area Konten Utama (Outlet) */}
            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
                <TopHeader />
                <Outlet />
            </div>

        </div>
    );
};

export default App;
