import DompetSkeleton from '../components/DompetSkeleton';
import Button from '../components/Button';
import useFirstLoad from '../hooks/useFirstLoad';
import { WalletIcon } from '@phosphor-icons/react';

// --- Data Dummy Dompet ---
// Ganti dengan data dari API nantinya
const walletsData = [
    { id: 1, title: 'Dompet Fisik', amount: '120.000' },
    { id: 2, title: 'Rekening BCA', amount: '12.240.000' },
];

// --- KOMPONEN: Card Dompet ---
const WalletCard = ({ title, amount, onEdit, onTransfer }) => (
    <div className="
    relative overflow-hidden bg-white p-6 rounded-xl 
    ring-1 ring-gray-950/5 
    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
    dark:bg-gray-900 dark:ring-white/10 dark:shadow-none
    transition duration-300 hover:ring-gray-950/10
    w-full flex flex-col justify-between
  ">
        
        {/* Info Dompet */}
        <div className="flex flex-col gap-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
            </h3>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-gray-400">Rp</span>
                <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                    {amount}
                </span>
            </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 mt-4">
            <Button
                onClick={onEdit}
                size="md"
                className="flex-1"
            >
                Edit
            </Button>
            <Button
                onClick={onTransfer}
                variant="secondary"
                size="md"
                className="flex-1"
            >
                Transfer Dana
            </Button>
        </div>
    </div>
);

// --- HALAMAN UTAMA: Dompet ---
/**
 * Halaman Dompet — menampilkan daftar dompet milik pengguna.
 * Sidebar dan layout utama dikelola oleh App.jsx.
 */
const Dompet = () => {
    // Skeleton hanya tampil sekali per sesi browser
    const isLoading = useFirstLoad('dompet', 250);

    // Handler placeholder — ganti dengan logika nyata / modal nantinya
    const handleEdit = (wallet) => {
        console.log('Edit dompet:', wallet);
        alert(`Edit dompet: ${wallet.title}`);
    };

    const handleTransfer = (wallet) => {
        console.log('Transfer dari dompet:', wallet);
        alert(`Transfer dari: ${wallet.title}`);
    };

    const handleTambahDompet = () => {
        console.log('Tambah dompet baru');
        alert('Tambah Dompet diklik');
    };

    // Tampilkan skeleton hanya saat pertama kali load di sesi ini
    if (isLoading) {
        return <DompetSkeleton />;
    }

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Dompet</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Atur sumber dana dan simpanan dengan mudah
                    </p>
                </div>
                <Button
                    onClick={handleTambahDompet}
                    size="md"
                >
                    <WalletIcon size={18} weight="bold" />
                    Tambah Dompet
                </Button>
            </div>

            {/* Grid Kartu Dompet */}
            <div className="px-8 pb-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-[750px]">
                    {walletsData.map((wallet) => (
                        <WalletCard
                            key={wallet.id}
                            title={wallet.title}
                            amount={wallet.amount}
                            onEdit={() => handleEdit(wallet)}
                            onTransfer={() => handleTransfer(wallet)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dompet;
