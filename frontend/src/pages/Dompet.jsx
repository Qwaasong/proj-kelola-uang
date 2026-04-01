import DompetSkeleton from '../components/DompetSkeleton';
import useFirstLoad from '../hooks/useFirstLoad';

// --- Data Dummy Dompet ---
// Ganti dengan data dari API nantinya
const walletsData = [
    { id: 1, title: 'Dompet Fisik', amount: '120.000' },
    { id: 2, title: 'Rekening BCA', amount: '12.240.000' },
];

// --- KOMPONEN: Card Dompet ---
const WalletCard = ({ title, amount, onEdit, onTransfer }) => (
    <div className="bg-white py-5 px-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full flex flex-col justify-between hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
        
        {/* Info Dompet */}
        <div className="mb-5">
            <h3 className="text-[14px] font-medium mb-1">{title}</h3>
            <p className="text-[28px] font-semibold flex items-baseline gap-1">
                <span className="text-[14px] text-gray-400 font-medium">Rp</span> {amount}
            </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
            <button
                onClick={onEdit}
                className="flex-1 bg-primary text-white text-[13px] py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
                Edit
            </button>
            <button
                onClick={onTransfer}
                className="flex-1 bg-secondary text-white text-[13px] py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
                Transfer Dana
            </button>
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
                <h1 className="text-2xl font-semibold text-secondary">Dompet</h1>
                <button
                    onClick={handleTambahDompet}
                    className="bg-primary text-white text-[13px] px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm"
                >
                    Tambah Dompet
                </button>
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
