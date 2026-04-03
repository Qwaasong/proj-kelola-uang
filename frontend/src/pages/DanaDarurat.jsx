import SummaryCard from '../components/SummaryCard';
import Table from '../components/Table';
import Button from '../components/Button';
import { 
    Stack as StackIcon, 
    Wallet as WalletIcon, 
    TrendUp as TrendUpIcon, 
    Gear as GearIcon,
    PencilSimple as PencilSimpleIcon,
    Trash as TrashIcon
} from '@phosphor-icons/react';
import useFirstLoad from '../hooks/useFirstLoad';
import DashboardSkeleton from '../components/DashboardSkeleton';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import { useState } from 'react';

/**
 * Halaman Dana Darurat.
 * Menampilkan target, progres, dan log transaksi dana darurat.
 */
const DanaDarurat = () => {
    // Simulasi loading state agar konsisten dengan halaman lain
    const isLoading = useFirstLoad('danadarurat', 250);

    // --- State Modals ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    // --- State Form ---
    const [walletId, setWalletId] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState('786.000');
    const [duration, setDuration] = useState('6');

    // Data Dummy Wallets
    const walletsData = [
        { id: 1, name: 'Dompet Fisik', icon: WalletIcon },
        { id: 2, name: 'Rekening BCA', icon: WalletIcon },
    ];

    // Data Dummy Log Transaksi Dana Darurat
    const logData = [
        { id: 1, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 2, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 3, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 4, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
        { id: 5, wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
    ];

    // Konfigurasi kolom tabel
    const columns = [
        { label: 'Dompet', key: 'wallet' },
        { label: 'Jumlah', key: 'amount', render: (val) => `Rp ${val}` },
        { label: 'Tanggal', key: 'date', align: 'right', className: 'text-gray-500' },
    ];

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto w-full">
            
            {/* Header Halaman */}
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
                        onClick={() => setIsTargetModalOpen(true)}
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

            {/* Konten Utama */}
            <div className="px-8 pb-10 flex flex-col gap-6 w-full">
                
                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard title="Terkumpul" amount="120.000" />
                    <SummaryCard title="Target" amount="786.000" />
                    <SummaryCard title="Selisih" amount="567.000" />
                    <SummaryCard title="Jangka Waktu" amount="6" showRp={false} suffix="Bulan" />
                </div>

                {/* Tabel Log Transaksi (Filament Style Container) */}
                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
                    
                    {/* Header Tabel Box */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <h2 className="text-[15px] font-semibold text-secondary">Log Transaksi</h2>
                    </div>

                    {/* Area Tabel */}
                    <Table 
                        columns={columns}
                        data={logData}
                        actions={[
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

            {/* Modal Tambah Dana Darurat */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Dana Darurat"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>Tambah Dana</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    
                    <Select 
                        label="Pilih Dompet Sumber"
                        placeholder="Misal: Rekening BCA..."
                        options={walletsData}
                        value={walletId}
                        onChange={(val) => setWalletId(val)}
                        icon={<WalletIcon size={18} weight="bold" />}
                    />
                    
                    <Input 
                        label="Jumlah Dana"
                        placeholder="Masukkan nominal tabungan"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={<TrendUpIcon size={18} weight="bold" className="text-primary" />}
                    />
                    
                    <Input 
                        label="Catatan (Opsional)"
                        placeholder="Misal: Sisa gaji bulan ini"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="textarea"
                    />

                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-[12px] text-primary font-medium leading-relaxed">
                            💡 Menambah dana darurat akan tercatat sebagai transaksi pengeluaran di dompet sumber dengan kategori "Dana Darurat".
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Modal Ubah Target */}
            <Modal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                title="Konfigurasi Dana Darurat"
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsTargetModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={() => setIsTargetModalOpen(false)}>Update Target</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    <Input 
                        label="Target Dana Total"
                        placeholder="Contoh: 15000000"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        icon={<StackIcon size={18} weight="bold" />}
                    />
                    
                    <Input 
                        label="Durasi (Bulan)"
                        placeholder="Contoh: 6"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        icon={<GearIcon size={18} weight="bold" />}
                    />

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estimasi Menabung</span>
                        <p className="text-secondary font-semibold">Rp 2.500.000 / Bulan</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DanaDarurat;

