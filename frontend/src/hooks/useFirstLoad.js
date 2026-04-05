import { useState, useEffect } from 'react';

/**
 * Hook useFirstLoad — mengontrol apakah skeleton loading perlu ditampilkan.
 *
 * Cara kerja:
 * - Menggunakan `sessionStorage` dengan key unik per halaman.
 * - Skeleton hanya muncul SEKALI per sesi browser (tab).
 * - Saat pengguna berpindah halaman lalu kembali, skeleton TIDAK muncul lagi.
 * - Key direset otomatis saat tab/browser ditutup (sessionStorage bersifat sementara).
 *
 * @param {string} pageKey - Key unik untuk halaman ini, misal: 'dashboard' atau 'dompet'
 * @param {number} [duration=250] - Durasi skeleton tampil dalam milidetik
 * @returns {boolean} isLoading - true selama skeleton seharusnya ditampilkan
 */
const useFirstLoad = (pageKey, duration = 250) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    return isLoading;
};

export default useFirstLoad;
