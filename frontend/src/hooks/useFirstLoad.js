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
    const storageKey = `laeva_loaded_${pageKey}`;

    // Cek apakah halaman ini sudah pernah dimuat di sesi ini
    const hasLoadedBefore = sessionStorage.getItem(storageKey) === 'true';

    const [isLoading, setIsLoading] = useState(!hasLoadedBefore);

    useEffect(() => {
        // Jika sudah pernah dimuat, tidak perlu timer — langsung keluar
        if (hasLoadedBefore) return;

        const timer = setTimeout(() => {
            // Tandai halaman sudah pernah dimuat di sesi ini
            sessionStorage.setItem(storageKey, 'true');
            setIsLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isLoading;
};

export default useFirstLoad;
