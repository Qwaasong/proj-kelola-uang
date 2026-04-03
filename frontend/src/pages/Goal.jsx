import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import { 
    Flag as FlagIcon, 
    Calendar as CalendarIcon, 
    TrendUp as TrendUpIcon, 
    Wallet as WalletIcon,
    PencilSimple as PencilSimpleIcon,
    Trash as TrashIcon
} from '@phosphor-icons/react';
import useFirstLoad from '../hooks/useFirstLoad';
import GoalSkeleton from '../components/GoalSkeleton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import { useState, useMemo } from 'react';

/**
 * Halaman Goal Keuangan.
 * Menampilkan ringkasan dan progres pencapaian target keuangan pengguna.
 */
const Goal = () => {
    // Simulasi loading state agar konsisten dengan halaman lain
    const isLoading = useFirstLoad('goal', 250);

    // --- State Modals ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    // --- State Form ---
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    
    // State Tabung
    const [walletId, setWalletId] = useState(null);
    const [saveAmount, setSaveAmount] = useState('');

    // Data Dummy Wallets
    const walletsData = [
        { id: 1, name: 'Dompet Fisik', icon: WalletIcon },
        { id: 2, name: 'Rekening BCA', icon: WalletIcon },
    ];

    // Logika Hitung Rekomendasi Menabung
    const monthlyRecommendation = useMemo(() => {
        if (!targetAmount || !deadline) return 0;
        
        const target = parseFloat(targetAmount.replace(/\D/g, '')) || 0;
        const now = new Date();
        const targetDate = new Date(deadline);
        
        const diffInMs = targetDate - now;
        const diffInMonths = Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 30.44)));
        
        return Math.ceil(target / diffInMonths);
    }, [targetAmount, deadline]);

    // Data Dummy Daftar Goal Keuangan
    const goalData = [
        { id: 1, name: 'Beli Laptop Baru', target: '15.000.000', progress: '12.000.000', status: '80%' },
        { id: 2, name: 'DP Rumah', target: '100.000.000', progress: '25.000.000', status: '25%' },
        { id: 3, name: 'Liburan ke Jepang', target: '30.000.000', progress: '30.000.000', status: 'Selesai' },
        { id: 4, name: 'Upgrade Setup Kerja', target: '5.000.000', progress: '1.250.000', status: '25%' },
        { id: 5, name: 'Dana Pendidikan', target: '50.000.000', progress: '5.000.000', status: '10%' },
    ];

    // Konfigurasi kolom tabel
    const columns = [
        { label: 'Nama Goal', key: 'name' },
        { label: 'Target', key: 'target', render: (val) => `Rp ${val}` },
        { label: 'Terkumpul', key: 'progress', render: (val) => `Rp ${val}` },
        { label: 'Status / Progres', key: 'status', align: 'right', className: 'font-semibold text-primary' },
    ];

    const handleOpenSave = (goal) => {
        setSelectedGoal(goal);
        setSaveAmount('');
        setWalletId(null);
        setIsSaveModalOpen(true);
    };

    if (isLoading) {
        return <GoalSkeleton />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            {/* Header Halaman */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Goal Keuangan</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Tentukan target impian Anda dan pantau pertumbuhannya setiap langkah
                    </p>
                </div>
                <Button 
                    size="md" 
                    icon={<FlagIcon size={18} weight="bold" />}
                    onClick={() => {
                        setGoalName('');
                        setTargetAmount('');
                        setDeadline('');
                        setDescription('');
                        setIsAddModalOpen(true);
                    }}
                >
                    Tambah Goal Baru
                </Button>
            </div>

            {/* Konten Utama */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                
                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard title="Total Target" amount="200.000.000" />
                    <SummaryCard title="Sudah Terkumpul" amount="73.250.000" />
                    <SummaryCard title="Sisa Dana" amount="126.750.000" />
                    <SummaryCard title="Rata-rata Menabung" amount="12.500.000" />
                </div>

                {/* Tabel Daftar Goal (Filament Style Container) */}
                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
                    
                    {/* Header Tabel Box */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <h2 className="text-[15px] font-semibold text-secondary">Daftar Goal</h2>
                    </div>

                    {/* Area Tabel */}
                    <Table 
                        columns={columns}
                        data={goalData}
                        actions={[
                            { 
                                label: 'Tabung', 
                                icon: <TrendUpIcon size={16} weight="bold" />, 
                                onClick: (row) => handleOpenSave(row) 
                            },
                            { 
                                label: 'Edit', 
                                icon: <PencilSimpleIcon size={16} />, 
                                onClick: (row) => console.log('Edit row:', row) 
                            },
                            { 
                                label: 'Delete', 
                                icon: <TrashIcon size={16} weight="bold" />, 
                                onClick: (row) => console.log('Delete row:', row),
                                variant: 'danger'
                            },
                        ]}
                    />

                    {/* Footer Tabel (Pagination) */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-t border-gray-100 gap-4 bg-[#FAFAFA]/50">
                        <span className="text-[12px] text-gray-500 font-medium">
                            Menampilkan 1 - 5 dari 5 hasil
                        </span>

                        <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                                <span className="text-[10px]">1</span>
                            </Button>
                        </div>
                    </div>

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
                        <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>Simpan Goal</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    <Input 
                        label="Nama Goal / Impian"
                        placeholder="Misal: Liburan ke Labuan Bajo"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        icon={<FlagIcon size={18} weight="bold" />}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input 
                            label="Target Dana"
                            placeholder="Contoh: 10000000"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            icon={<TrendUpIcon size={18} weight="bold" />}
                        />
                        <Input 
                            label="Deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            icon={<CalendarIcon size={18} weight="bold" />}
                        />
                    </div>

                    <Input 
                        label="Deskripsi (Opsional)"
                        placeholder="Tambahkan detail target Anda..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="textarea"
                    />

                    {monthlyRecommendation > 0 && (
                        <div className="bg-[#F0F7F4] border border-primary/20 rounded-xl p-4 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-300">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Rekomendasi Menabung</span>
                            <p className="text-secondary font-semibold">Rp {monthlyRecommendation.toLocaleString('id-ID')} / Bulan</p>
                            <p className="text-[10px] text-gray-500 italic">
                                * Berdasarkan target dana dan deadline yang ditentukan.
                            </p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal Tabung ke Goal */}
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title={`Tabung untuk ${selectedGoal?.name}`}
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={() => setIsSaveModalOpen(false)}>Konfirmasi Menabung</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Goal Terpilih</span>
                        <div className="flex justify-between items-center">
                            <span className="text-secondary font-semibold">{selectedGoal?.name}</span>
                            <span className="text-sm font-medium text-primary">Sisa: Rp {(parseFloat(selectedGoal?.target.replace(/\D/g, '')) - parseFloat(selectedGoal?.progress.replace(/\D/g, ''))).toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <Select 
                        label="Sumber Dana (Dompet)"
                        placeholder="Pilih dompet..."
                        options={walletsData}
                        value={walletId}
                        onChange={(val) => setWalletId(val)}
                        icon={<WalletIcon size={18} weight="bold" />}
                    />
                    
                    <Input 
                        label="Jumlah Tabungan"
                        placeholder="Masukkan nominal"
                        type="number"
                        value={saveAmount}
                        onChange={(e) => setSaveAmount(e.target.value)}
                        icon={<TrendUpIcon size={18} weight="bold" className="text-primary" />}
                    />

                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-[12px] text-primary font-medium leading-relaxed">
                            💡 Menabung ke goal akan otomatis mencatat transaksi pengeluaran di dompet sumber dengan kategori "Tabungan Goal".
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Goal;

