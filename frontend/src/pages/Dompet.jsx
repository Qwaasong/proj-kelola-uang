import DompetSkeleton from '../components/DompetSkeleton';
import Button from '../components/Button';
import useFirstLoad from '../hooks/useFirstLoad';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import { useState, useMemo } from 'react';
import { WalletIcon, BankIcon, ArrowsLeftRightIcon} from '@phosphor-icons/react';

// --- Data Dummy Dompet ---
// Ganti dengan data dari API nantinya
const walletsData = [
    { id: 1, title: 'Dompet Fisik', amount: '120.000' },
    { id: 2, title: 'Rekening BCA', amount: '12.240.000' },
];

// --- KOMPONEN: Card Dompet ---
const WalletCard = ({ title, amount, onEdit, onTransfer }) => (
    <div className="
    group relative overflow-hidden bg-white p-6 rounded-xl 
    ring-1 ring-gray-950/5 
    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
    dark:bg-gray-900 dark:ring-white/10 dark:shadow-none
    transition duration-300 hover:ring-gray-950/10 w-full flex flex-col justify-between
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

    // --- State Modal & Form ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletName, setWalletName] = useState('');
    const [walletBalance, setWalletBalance] = useState('');

    // State Edit Dompet
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);

    // State Transfer Dana
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [sourceWallet, setSourceWallet] = useState(null);
    const [targetWalletId, setTargetWalletId] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');

    // Pre-pilihan untuk dropdown transfer (kecuali pengirim)
    const transferOptions = useMemo(() => {
        if (!sourceWallet) return [];
        return walletsData
            .filter(w => w.id !== sourceWallet.id)
            .map(w => ({
                id: w.id,
                name: w.title,
                icon: WalletIcon
            }));
    }, [sourceWallet]);

    // Validasi saldo untuk transfer
    const isBalanceInsufficient = useMemo(() => {
        if (!sourceWallet || !transferAmount) return false;
        const amount = parseFloat(transferAmount.replace(/\D/g, '')) || 0;
        const sourceBalance = parseFloat(sourceWallet.amount.replace(/\D/g, '')) || 0;
        return amount > sourceBalance;
    }, [sourceWallet, transferAmount]);

    // Handler placeholder — ganti dengan logika nyata / modal nantinya
    const handleEdit = (wallet) => {
        setEditingWallet(wallet);
        setWalletName(wallet.title);
        setWalletBalance(wallet.amount);
        setIsEditModalOpen(true);
    };

    const handleTransfer = (wallet) => {
        setSourceWallet(wallet);
        setIsTransferModalOpen(true);
    };

    const handleTambahDompet = () => {
        setIsModalOpen(true);
    };

    const handleSaveWallet = (e) => {
        e.preventDefault();
        console.log('Menyimpan dompet baru:', { name: walletName, balance: walletBalance });
        
        // Reset form & tutup modal
        setWalletName('');
        setWalletBalance('');
        setIsModalOpen(false);
        
        alert(`Dompet "${walletName}" berhasil ditambahkan! (Simulasi)`);
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

            {/* Modal Tambah Dompet */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah Dompet Baru"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSaveWallet}
                            disabled={!walletName || !walletBalance}
                        >
                            Simpan Dompet
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSaveWallet} className="flex flex-col gap-5">
                    <p className="text-gray-500 text-[13px] mb-1">
                        Masukkan rincian sumber dana baru Anda untuk mulai mencatat transaksi.
                    </p>

                    <Input 
                        label="Nama Dompet"
                        placeholder="Misal: Kantong Jajan, Bank Mandiri"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        icon={<WalletIcon size={18} weight="bold" />}
                        required
                    />

                    <Input 
                        label="Saldo Awal / Dana"
                        placeholder="Contoh: 1.000.000"
                        value={walletBalance}
                        onChange={(e) => setWalletBalance(e.target.value)}
                        icon={<BankIcon size={18} weight="bold" />}
                        type="number"
                        required
                    />
                </form>
            </Modal>

            {/* Modal Edit Dompet */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Dompet"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="primary" onClick={() => setIsEditModalOpen(false)}>
                            Simpan Perubahan
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-5">
                    <Input 
                        label="Nama Dompet"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        icon={<WalletIcon size={18} weight="bold" />}
                    />
                    <Input 
                        label="Saldo Saat Ini"
                        value={walletBalance}
                        onChange={(e) => setWalletBalance(e.target.value)}
                        icon={<BankIcon size={18} weight="bold" />}
                        type="number"
                    />
                </div>
            </Modal>

            {/* Modal Transfer Dana */}
            <Modal
                isOpen={isTransferModalOpen}
                onClose={() => {
                    setIsTransferModalOpen(false);
                    setTransferAmount('');
                    setTargetWalletId(null);
                }}
                title="Transfer Antar Dompet"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
                            Batal
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => setIsTransferModalOpen(false)}
                            disabled={!targetWalletId || !transferAmount || isBalanceInsufficient}
                        >
                            Konfirmasi Transfer
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    {/* Source Wallet Info (Pengirim) */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sumber Dana</span>
                        <div className="flex justify-between items-center">
                            <span className="text-secondary font-semibold">{sourceWallet?.title}</span>
                            <span className="text-sm font-medium text-primary">Rp {sourceWallet?.amount}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center -my-3 z-10 relative">
                        <div className="bg-white p-2 rounded-full ring-4 ring-white shadow-sm border border-gray-100">
                            <ArrowsLeftRightIcon size={20} className="text-primary" weight="bold" />
                        </div>
                    </div>

                    <form className="flex flex-col gap-5">
                        <Select 
                            label="Dompet Tujuan"
                            placeholder="Pilih dompet penerima..."
                            options={transferOptions}
                            value={targetWalletId}
                            onChange={(val) => setTargetWalletId(val)}
                            icon={<WalletIcon size={18} weight="bold" />}
                        />

                        <div className="flex flex-col">
                            <Input 
                                label="Jumlah Transfer"
                                placeholder="Masukkan nominal (Tanpa titik)"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                icon={<BankIcon size={18} weight="bold" />}
                                type="number"
                                error={isBalanceInsufficient ? 'Jumlah melebihi saldo yang tersedia' : ''}
                            />
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default Dompet;
