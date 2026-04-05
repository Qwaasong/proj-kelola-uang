import DompetSkeleton from '../components/DompetSkeleton';
import Button from '../components/Button';
import useFirstLoad from '../hooks/useFirstLoad';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import EmptyState from '../components/EmptyState';
import { useState, useMemo, useEffect } from 'react';
import { WalletIcon, BankIcon, ArrowsLeftRightIcon, TrashIcon } from '@phosphor-icons/react';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

// --- KOMPONEN: Card Dompet ---
const WalletCard = ({ title, amount, onEdit, onTransfer, onDelete }) => (
    <div className="
    group relative overflow-hidden bg-white p-6 rounded-xl 
    ring-1 ring-gray-950/5 
    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
    dark:bg-gray-900 dark:ring-white/10 dark:shadow-none
    transition duration-300 hover:ring-gray-950/10 w-full flex flex-col justify-between
  ">
        <button 
            onClick={onDelete}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <TrashIcon size={18} />
        </button>
        
        {/* Info Dompet */}
        <div className="flex flex-col gap-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
            </h3>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-gray-400">Rp</span>
                <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                    {new Intl.NumberFormat('id-ID').format(amount)}
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
const Dompet = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('dompet', 250);
    const [fetchDompet, { data: dompetData, loading: loadingDompet }] = useApi();
    const [actionApi, { loading: loadingAction }] = useApi();

    // --- State Modal & Form ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletName, setWalletName] = useState('');
    const [walletBalance, setWalletBalance] = useState('');

    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [sourceWallet, setSourceWallet] = useState(null);
    const [targetWalletId, setTargetWalletId] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');

    const loadData = async () => {
        try {
            await fetchDompet('GET', '/dompet');
        } catch (err) {
            if (err.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchDompet, navigate]);

    const wallets = dompetData?.data || [];

    const transferOptions = useMemo(() => {
        if (!sourceWallet) return [];
        return wallets
            .filter(w => w.id !== sourceWallet.id)
            .map(w => ({
                id: w.id,
                name: w.nama_dompet,
                icon: WalletIcon
            }));
    }, [sourceWallet, wallets]);

    const isBalanceInsufficient = useMemo(() => {
        if (!sourceWallet || !transferAmount) return false;
        const amount = parseFloat(transferAmount) || 0;
        return amount > sourceWallet.saldo;
    }, [sourceWallet, transferAmount]);

    const handleSaveWallet = async (e) => {
        e.preventDefault();
        try {
            await actionApi('POST', '/dompet', { 
                nama_dompet: walletName, 
                saldo: walletBalance 
            });
            setIsModalOpen(false);
            setWalletName('');
            setWalletBalance('');
            loadData();
        } catch (err) {
            alert("Gagal menambah dompet: " + err.message);
        }
    };

    const handleTransfer = async () => {
        try {
            await actionApi('PUT', '/dompet/transfer', {
                dari_dompet_id: sourceWallet.id,
                ke_dompet_id: targetWalletId,
                jumlah: transferAmount
            });
            setIsTransferModalOpen(false);
            setTransferAmount('');
            setTargetWalletId(null);
            loadData();
        } catch (err) {
            alert("Transfer gagal: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus dompet ini? Semua riwayat transaksi akan tetap ada tetapi dompet tidak bisa digunakan.")) return;
        try {
            await actionApi('DELETE', `/dompet?id=${id}`);
            loadData();
        } catch (err) {
            alert("Gagal menghapus: " + err.message);
        }
    };

    if (isFirstLoad || (loadingDompet && !dompetData)) {
        return <DompetSkeleton />;
    }

    return (
        <>
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Dompet</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Atur sumber dana dan simpanan dengan mudah
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="md">
                    <WalletIcon size={18} weight="bold" />
                    Tambah Dompet
                </Button>
            </div>

            <div className="px-8 pb-10 w-full max-w-[1400px]">
                {!wallets.length ? (
                    <div className="max-w-[750px] bg-white rounded-xl ring-1 ring-gray-950/5 p-8">
                        <EmptyState 
                            title="Dompet Anda Masih Kosong"
                            description="Tambahkan dompet atau rekening bank untuk mulai mencatat saldo dan mengelola dana Anda secara terpusat."
                            buttonText="Tambah Dompet Baru"
                            onButtonClick={() => setIsModalOpen(true)}
                            icon={<WalletIcon size={18} weight="bold" />}
                            className="py-8"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-[750px]">
                        {wallets.map((wallet) => (
                            <WalletCard
                                key={wallet.id}
                                title={wallet.nama_dompet}
                                amount={wallet.saldo}
                                onEdit={() => alert("Fitur edit akan segera hadir!")}
                                onTransfer={() => {
                                    setSourceWallet(wallet);
                                    setIsTransferModalOpen(true);
                                }}
                                onDelete={() => handleDelete(wallet.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tambah Dompet */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah Dompet Baru"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSaveWallet}
                            disabled={!walletName || !walletBalance || loadingAction}
                        >
                            {loadingAction ? 'Menyimpan...' : 'Simpan Dompet'}
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-5">
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
                        placeholder="Contoh: 1000000"
                        value={walletBalance}
                        onChange={(e) => setWalletBalance(e.target.value)}
                        icon={<BankIcon size={18} weight="bold" />}
                        type="number"
                        required
                    />
                </form>
            </Modal>

            {/* Modal Transfer */}
            <Modal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                title="Transfer Antar Dompet"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>Batal</Button>
                        <Button 
                            variant="primary" 
                            onClick={handleTransfer}
                            disabled={!targetWalletId || !transferAmount || isBalanceInsufficient || loadingAction}
                        >
                            {loadingAction ? 'Memproses...' : 'Konfirmasi Transfer'}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <span className="text-[11px] font-bold text-gray-500 uppercase">Sumber: {sourceWallet?.nama_dompet}</span>
                        <div className="text-primary font-bold">Saldo: Rp {new Intl.NumberFormat('id-ID').format(sourceWallet?.saldo || 0)}</div>
                    </div>
                    <form className="flex flex-col gap-5">
                        <Select 
                            label="Dompet Tujuan"
                            placeholder="Pilih dompet penerima..."
                            options={transferOptions}
                            value={targetWalletId}
                            onChange={(val) => setTargetWalletId(val)}
                        />
                        <Input 
                            label="Jumlah Transfer"
                            placeholder="Masukkan nominal"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            type="number"
                            error={isBalanceInsufficient ? 'Saldo tidak cukup' : ''}
                        />
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default Dompet;
