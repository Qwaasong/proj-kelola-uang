import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import { 
    Stack as StackIcon, 
    Wallet as WalletIcon, 
    TrendUp as TrendUpIcon, 
    Gear as GearIcon,
} from '@phosphor-icons/react';
import useFirstLoad from '../hooks/useFirstLoad';
import DanaDaruratSkeleton from '../components/DanaDaruratSkeleton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import EmptyState from '../components/EmptyState';
import { useState, useEffect, useMemo } from 'react';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

/**
 * Halaman Dana Darurat.
 * Menghubungkan data progres dan log transaksi ke API backend.
 */
const DanaDarurat = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('danadarurat', 250);
    const [fetchStatus, { data: statusData, loading: loadingStatus }] = useApi();
    const [fetchWallets, { data: walletData }] = useApi();
    const [actionApi, { loading: loadingAction }] = useApi();

    // --- State Modals ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    // --- State Form ---
    const [walletId, setWalletId] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    const loadData = async () => {
        try {
            await fetchStatus('GET', '/dana-darurat');
            if (!walletData) await fetchWallets('GET', '/dompet');
        } catch (err) {
            if (err.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchStatus, navigate]);

    const status = statusData?.data || { jumlah_target: 0, jumlah_terkumpul: 0, log: [] };
    const wallets = useMemo(() => 
        (walletData?.data || []).map(w => ({ id: w.id, name: w.nama_dompet, icon: WalletIcon })), 
    [walletData]);

    const handleSetTarget = async (e) => {
        e.preventDefault();
        try {
            await actionApi('POST', '/dana-darurat', { jumlah_target: targetAmount });
            setIsTargetModalOpen(false);
            loadData();
        } catch (err) {
            alert("Gagal update target: " + err.message);
        }
    };

    const handleAddFund = async (e) => {
        e.preventDefault();
        try {
            await actionApi('PUT', '/dana-darurat/tambah', { 
                dompet_id: walletId, 
                jumlah: amount,
                keterangan: description 
            });
            setIsAddModalOpen(false);
            setAmount('');
            setWalletId(null);
            setDescription('');
            loadData();
        } catch (err) {
            alert("Gagal menambah dana: " + err.message);
        }
    };

    const formatIDR = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    const columns = [
        { label: 'Dompet Sumber', key: 'nama_dompet' },
        { label: 'Jumlah', key: 'jumlah', render: (val) => `Rp ${formatIDR(val)}` },
        { label: 'Tanggal', key: 'tanggal', align: 'right', className: 'text-gray-500' },
    ];

    if (isFirstLoad || !statusData) {
        return <DanaDaruratSkeleton />;
    }

    const selisih = Math.max(0, status.jumlah_target - status.jumlah_terkumpul);

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Dana Darurat</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Pantau progres dan kelola dana cadangan masa depan anda
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="secondary" 
                        size="md" 
                        icon={<GearIcon size={18} weight="bold" />}
                        onClick={() => {
                            setTargetAmount(status.jumlah_target);
                            setIsTargetModalOpen(true);
                        }}
                    >
                        Ubah Target
                    </Button>
                    <Button 
                        size="md" 
                        icon={<StackIcon size={18} weight="bold" />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Tambah Dana Darurat
                    </Button>
                </div>
            </div>

            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SummaryCard title="Terkumpul" amount={formatIDR(status.jumlah_terkumpul)} />
                    <SummaryCard title="Target" amount={formatIDR(status.jumlah_target)} />
                    <SummaryCard title="Selisih" amount={formatIDR(selisih)} />
                </div>

                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <h2 className="text-[15px] font-semibold text-secondary">Riwayat Menabung Dana Darurat</h2>
                    </div>

                    {statusData && (!status.log || status.log.length === 0) ? (
                        <EmptyState 
                            title="Belum Ada Riwayat Menabung Dana Darurat"
                            description="Mulai alokasikan dana dari dompet Anda untuk membangun jaring pengaman keuangan di masa depan."
                            buttonText="Tambah Dana Darurat"
                            onButtonClick={() => setIsAddModalOpen(true)}
                            className="py-12"
                        />
                    ) : (
                        <Table 
                            columns={columns}
                            data={status.log || []}
                        />
                    )}
                </div>
            </div>

            {/* Modal Tambah Dana */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Dana Darurat"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={handleAddFund} disabled={loadingAction || !walletId || !amount}>
                            {loadingAction ? 'Memproses...' : 'Tambah Dana'}
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-6">
                    <Select 
                        label="Pilih Dompet Sumber"
                        placeholder="Pilih dompet..."
                        options={wallets}
                        value={walletId}
                        onChange={(val) => setWalletId(val)}
                        icon={<WalletIcon size={18} weight="bold" />}
                    />
                    <Input 
                        label="Jumlah Dana"
                        placeholder="Contoh: 500000"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={<TrendUpIcon size={18} weight="bold" className="text-green-500" />}
                    />
                    <Input 
                        label="Catatan (Opsional)"
                        placeholder="Misal: Alokasi dari sisa belanja"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="textarea"
                    />
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-[12px] text-primary">
                        💡 Penambahan dana darurat akan memotong saldo dompet yang dipilih secara otomatis.
                    </div>
                </form>
            </Modal>

            {/* Modal Target */}
            <Modal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                title="Konfigurasi Dana Darurat"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsTargetModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={handleSetTarget} disabled={loadingAction || !targetAmount}>
                            {loadingAction ? 'Updating...' : 'Update Target'}
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-6">
                    <Input 
                        label="Target Dana Total (Rp)"
                        placeholder="Masukkan target total dana darurat"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        icon={<StackIcon size={18} weight="bold" />}
                        type="number"
                    />
                </form>
            </Modal>
        </div>
    );
};

export default DanaDarurat;
