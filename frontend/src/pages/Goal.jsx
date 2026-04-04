import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import { 
    Flag as FlagIcon, 
    Calendar as CalendarIcon, 
    TrendUp as TrendUpIcon, 
    Wallet as WalletIcon,
    Trash as TrashIcon
} from '@phosphor-icons/react';
import useFirstLoad from '../hooks/useFirstLoad';
import GoalSkeleton from '../components/GoalSkeleton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import { useState, useMemo, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

/**
 * Halaman Goal Keuangan.
 * Menghubungkan data target keuangan pengguna ke API backend.
 */
const Goal = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('goal', 250);
    const [fetchGoals, { data: goalData, loading: loadingGoals }] = useApi();
    const [fetchWallets, { data: walletData }] = useApi();
    const [actionApi, { loading: loadingAction }] = useApi();

    // --- State Modals ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    // --- State Form ---
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    
    const [walletId, setWalletId] = useState(null);
    const [saveAmount, setSaveAmount] = useState('');

    const loadData = async () => {
        try {
            await fetchGoals('GET', '/target');
            if (!walletData) await fetchWallets('GET', '/dompet');
        } catch (err) {
            if (err.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchGoals, navigate]);

    const goals = goalData?.data || [];
    const wallets = useMemo(() => 
        (walletData?.data || []).map(w => ({ id: w.id, name: w.nama_dompet, icon: WalletIcon })), 
    [walletData]);

    const formatIDR = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            await actionApi('POST', '/target', {
                nama_target: goalName,
                jumlah_target: targetAmount,
                deadline: deadline
            });
            setIsAddModalOpen(false);
            setGoalName('');
            setTargetAmount('');
            setDeadline('');
            loadData();
        } catch (err) {
            alert("Gagal membuat goal: " + err.message);
        }
    };

    const handleAddSaving = async (e) => {
        e.preventDefault();
        try {
            await actionApi('PUT', '/target/tambah', {
                target_id: selectedGoal.id,
                dompet_id: walletId,
                jumlah: saveAmount
            });
            setIsSaveModalOpen(false);
            setSaveAmount('');
            setWalletId(null);
            loadData();
        } catch (err) {
            alert("Gagal menabung: " + err.message);
        }
    };

    const handleDeleteGoal = async (id) => {
        if (!confirm("Hapus target ini? Data tidak dapat dikembalikan.")) return;
        try {
            await actionApi('DELETE', `/target?id=${id}`);
            loadData();
        } catch (err) {
            alert("Gagal menghapus: " + err.message);
        }
    };

    const columns = [
        { label: 'Nama Goal', key: 'nama_target', className: 'font-bold' },
        { label: 'Target', key: 'jumlah_target', render: (val) => `Rp ${formatIDR(val)}` },
        { label: 'Terkumpul', key: 'terkumpul', render: (val) => `Rp ${formatIDR(val)}` },
        { 
            label: 'Progres', 
            key: 'terkumpul', 
            render: (val, row) => {
                const percent = Math.min(100, Math.round((val / row.jumlah_target) * 100));
                return <span className="text-primary font-bold">{percent}%</span>
            },
            align: 'right'
        },
    ];

    if (isFirstLoad || (loadingGoals && !goalData)) return <GoalSkeleton />;

    const totalTarget = goals.reduce((acc, g) => acc + parseFloat(g.jumlah_target), 0);
    const totalTerkumpul = goals.reduce((acc, g) => acc + parseFloat(g.terkumpul), 0);

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Goal Keuangan</h1>
                    <p className="text-sm text-gray-500 font-medium">Tentukan target impian Anda dan pantau pertumbuhannya</p>
                </div>
                <Button size="md" icon={<FlagIcon size={18} weight="bold" />} onClick={() => setIsAddModalOpen(true)}>
                    Tambah Goal Baru
                </Button>
            </div>

            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard title="Total Target" amount={formatIDR(totalTarget)} />
                    <SummaryCard title="Total Terkumpul" amount={formatIDR(totalTerkumpul)} />
                    <SummaryCard title="Sisa Dana" amount={formatIDR(totalTarget - totalTerkumpul)} />
                </div>

                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <h2 className="text-[15px] font-semibold text-secondary">Daftar Goal Saya</h2>
                    </div>

                    <Table 
                        columns={columns}
                        data={goals}
                        actions={[
                            { 
                                label: 'Tabung', 
                                icon: <TrendUpIcon size={16} weight="bold" />, 
                                onClick: (row) => { setSelectedGoal(row); setIsSaveModalOpen(true); }
                            },
                            { 
                                label: 'Delete', 
                                icon: <TrashIcon size={16} weight="bold" />, 
                                onClick: (row) => handleDeleteGoal(row.id),
                                variant: 'danger'
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Modal Tambah Goal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Buat Goal Baru"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={handleCreateGoal} disabled={loadingAction || !goalName || !targetAmount}>
                            {loadingAction ? 'Menyimpan...' : 'Simpan Goal'}
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-6">
                    <Input label="Nama Goal / Impian" placeholder="Misal: Beli MacBook Pro" value={goalName} onChange={(e) => setGoalName(e.target.value)} icon={<FlagIcon size={18} weight="bold" />} />
                    <div className="grid grid-cols-2 gap-5">
                        <Input label="Target Dana (Rp)" placeholder="Contoh: 20000000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} type="number" />
                        <Input label="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>
                </form>
            </Modal>

            {/* Modal Tabung */}
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title={`Menabung untuk ${selectedGoal?.nama_target}`}
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={handleAddSaving} disabled={loadingAction || !walletId || !saveAmount}>
                            {loadingAction ? 'Memproses...' : 'Konfirmasi Menabung'}
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-6">
                    <Select label="Sumber Dana" placeholder="Pilih dompet..." options={wallets} value={walletId} onChange={setWalletId} />
                    <Input label="Jumlah Tabungan (Rp)" placeholder="Masukkan nominal" type="number" value={saveAmount} onChange={(e) => setSaveAmount(e.target.value)} />
                </form>
            </Modal>
        </div>
    );
};

export default Goal;
