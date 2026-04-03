import { useState, useRef, useEffect } from 'react';
import { 
    ArrowsLeftRight as ArrowsLeftRightIcon,
    Funnel as FunnelIcon, 
    MagnifyingGlass as MagnifyingGlassIcon, 
    CaretDown as CaretDownIcon, 
    CaretLeft as CaretLeftIcon, 
    CaretRight as CaretRightIcon,
    Trash as TrashIcon,
    PencilSimple as PencilSimpleIcon,
    TrendUp as TrendUpIcon,
    TrendDown as TrendDownIcon,
    Repeat as RepeatIcon,
    Calendar as CalendarIcon,
    ClockClockwise as ClockClockwiseIcon,
    Wallet as WalletIcon
} from '@phosphor-icons/react';
import TransaksiSkeleton from '../components/TransaksiSkeleton';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Select from '../components/Select';
import useFirstLoad from '../hooks/useFirstLoad';

// --- Data Dummy Transaksi ---
const initialData = [
    { id: 1, type: 'Pemasukan', wallet: 'BCA', amount: '120.000', date: '30 Maret 2026', description: 'Gaji Bulanan' },
    { id: 2, type: 'Pengeluaran', wallet: 'BCA', amount: '45.000', date: '31 Maret 2026', description: 'Makan Siang' },
];

const transactionTypes = [
    { id: 'pemasukan', name: 'Pemasukan', icon: TrendUpIcon },
    { id: 'pengeluaran', name: 'Pengeluaran', icon: TrendDownIcon },
    { id: 'pemasukan_berulang', name: 'Pemasukan Berulang', icon: ClockClockwiseIcon },
    { id: 'pengeluaran_berulang', name: 'Pengeluaran Berulang', icon: RepeatIcon },
];

const walletsData = [
    { id: 1, name: 'Dompet Fisik', icon: WalletIcon },
    { id: 2, name: 'Rekening BCA', icon: WalletIcon },
    { id: 3, name: 'Bank Mandiri', icon: WalletIcon },
];

const categoryOptions = [
    { id: 1, name: 'Makan & Minum', icon: TrendDownIcon },
    { id: 2, name: 'Transportasi', icon: TrendDownIcon },
    { id: 3, name: 'Hiburan', icon: TrendDownIcon },
    { id: 4, name: 'Gaji', icon: TrendUpIcon },
    { id: 5, name: 'Belanja', icon: TrendDownIcon },
];

/**
 * Halaman Transaksi — menampilkan daftar semua transaksi masuk/keluar.
 */
const Transaksi = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
    const bulkRef = useRef(null);

    // --- State Modals ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    // --- State Form ---
    const [type, setType] = useState('pemasukan');
    const [walletId, setWalletId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [limitDate, setLimitDate] = useState('');

    const isRecurring = type.includes('berulang');

    // Toggle day for multi-day picker
    const toggleDay = (day) => {
        setSelectedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    // Skeleton hanya tampil sekali per sesi browser
    const isLoading = useFirstLoad('transaksi', 250);

    // Menutup dropdown klik diluar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bulkRef.current && !bulkRef.current.contains(event.target)) {
                setIsBulkDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Action Handlers ---
    const handleOpenAdd = () => {
        setAmount('');
        setDescription('');
        setWalletId(null);
        setCategoryId(null);
        setType('pemasukan');
        setSelectedDays([]);
        setLimitDate('');
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (row) => {
        setEditingRow(row);
        setAmount(row.amount.replace(/\D/g, ''));
        setDescription(row.description || '');
        // Mencari ID tipe yang sesuai (berbasis teks dummy sementara)
        const typeId = row.type.toLowerCase().includes('berulang') 
            ? (row.type.toLowerCase().includes('pemasukan') ? 'pemasukan_berulang' : 'pengeluaran_berulang')
            : (row.type.toLowerCase().includes('pemasukan') ? 'pemasukan' : 'pengeluaran');
        setType(typeId);
        setIsEditModalOpen(true);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(initialData.map(row => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleToggleSelectRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleDeleteBulk = () => {
        console.log('Delete selected:', selectedRows);
        alert(`Menghapus ${selectedRows.length} transaksi terpilih`);
        setSelectedRows([]);
        setIsBulkDropdownOpen(false);
    };

    // --- Konfigurasi Tabel ---
    const columns = [
        { label: 'Tipe', key: 'type', className: 'font-bold text-secondary' },
        { label: 'Dompet', key: 'wallet', hideOnMobile: true },
        { label: 'Jumlah', key: 'amount' },
        { label: 'Tanggal', key: 'date', className: 'text-gray-500 whitespace-nowrap', hideOnMobile: true },
    ];

    const actions = [
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
    ];

    if (isLoading) {
        return <TransaksiSkeleton />;
    }

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Transaksi</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        Kelola dan pantau seluruh riwayat transaksi keuangan anda
                    </p>
                </div>
                <Button 
                    size="md"
                    onClick={handleOpenAdd}
                >
                    <ArrowsLeftRightIcon size={18} weight="bold" />
                    Tambah Transaksi</Button>
            </div>

            {/* Main Table Container */}
            <div className="px-8 pb-10 w-full max-w-[1450px]">
                <div className="
                    relative overflow-hidden bg-white rounded-xl 
                    ring-1 ring-gray-950/5 
                    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
                    dark:bg-gray-900 dark:ring-white/10 dark:shadow-none
                    flex flex-col w-full
                ">
                    
                    {/* Toolbar */}
                    <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 flex-wrap gap-4 bg-white">
                        
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-9 gap-2 text-[13px] font-medium"
                            >
                                <span>Filter</span>
                                <FunnelIcon size={13} weight="bold" />
                            </Button>

                            {selectedRows.length > 0 && (
                                <div className="relative" ref={bulkRef}>
                                    <Button 
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                                        className="h-9 gap-2 text-[13px] font-medium"
                                        icon={<CaretDownIcon size={13} weight="bold" className={`text-white transition-transform order-last ${isBulkDropdownOpen ? 'rotate-180' : ''}`} />}
                                    >
                                        <span>Bulk Action</span>
                                        <span className="bg-white/20 px-1.5 py-[2px] rounded text-[11px]">{selectedRows.length}</span>
                                    </Button>

                                    {isBulkDropdownOpen && (
                                        <div className="absolute top-11 left-0 w-44 bg-white rounded-lg shadow-lg ring-1 ring-gray-950/5 py-1.5 z-20 animate-[fadeIn_0.15s_ease-out]">
                                            <button 
                                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#E74C3C] hover:bg-red-50 transition-colors flex items-center gap-2"
                                                onClick={handleDeleteBulk}
                                            >
                                                <TrashIcon size={16} weight="bold" /> Delete Selected
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="w-full sm:w-[320px]">
                            <Input 
                                placeholder="Cari transaksi..."
                                icon={<MagnifyingGlassIcon size={18} />}
                                size="md"
                            />
                        </div>
                    </div>

                    <Table 
                        columns={columns}
                        data={initialData}
                        selectedRows={selectedRows}
                        onToggleSelect={handleToggleSelectRow}
                        onSelectAll={handleSelectAll}
                        actions={[
                            { 
                                label: 'Edit', 
                                icon: <PencilSimpleIcon size={16} />, 
                                onClick: (row) => handleOpenEdit(row) 
                            },
                            { 
                                label: 'Delete', 
                                icon: <TrashIcon size={16} weight="bold" />, 
                                onClick: (row) => console.log('Delete row:', row),
                                variant: 'danger'
                            },
                        ]}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-t border-gray-100 gap-4 bg-[#FAFAFA]/50">
                        <span className="text-[12px] text-gray-500 font-medium">
                            Menampilkan 1 - 5 dari 5 hasil
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                                <CaretLeftIcon size={14} weight="bold" />
                            </Button>
                            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                                1
                            </Button>
                            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                                <CaretRightIcon size={14} weight="bold" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Transaksi */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Transaksi"
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>Simpan Transaksi</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-5">
                    <Select 
                        label="Tipe Transaksi"
                        options={transactionTypes}
                        value={type}
                        onChange={(val) => setType(val)}
                    />
                    <Select 
                        label="Pilih Kategori"
                        placeholder="Pilih kategori..."
                        options={categoryOptions}
                        value={categoryId}
                        onChange={(val) => setCategoryId(val)}
                    />
                    <Select 
                        label="Pilih Dompet"
                        placeholder="Pilih sumber dana..."
                        options={walletsData}
                        value={walletId}
                        onChange={(val) => setWalletId(val)}
                    />
                    
                    <Input 
                        label="Jumlah Transaksi"
                        placeholder="Misal: 50000"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={<ArrowsLeftRightIcon size={18} weight="bold" />}
                    />

                    {isRecurring && (
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col gap-3">
                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider px-1">
                                    Setiap Tanggal (Pilih multi tanggal)
                                </label>
                                <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                        const isSelected = selectedDays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`
                                                    h-9 w-full flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200
                                                    ${isSelected 
                                                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <Input 
                                label="Batas Tanggal (Berakhir pada)"
                                type="date"
                                value={limitDate}
                                onChange={(e) => setLimitDate(e.target.value)}
                                icon={<CalendarIcon size={18} weight="bold" />}
                            />
                        </div>
                    )}

                    <Input 
                        label="Deskripsi"
                        placeholder="Tambahkan catatan jika perlu..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="textarea"
                        rows={3}
                    />
                </div>
            </Modal>

            {/* Modal Edit Transaksi (Menggunakan struktur yang sama) */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Transaksi"
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                        <Button variant="primary" onClick={() => setIsEditModalOpen(false)}>Simpan Perubahan</Button>
                    </div>
                }
            >
                {/* Isi modal edit sama dengan tambah, biasanya dipisah komponen namun ini efisien untuk demo */}
                <div className="flex flex-col gap-5">
                    <Select 
                        label="Tipe Transaksi"
                        options={transactionTypes}
                        value={type}
                        onChange={(val) => setType(val)}
                    />
                    <Select 
                        label="Pilih Kategori"
                        placeholder="Pilih kategori..."
                        options={categoryOptions}
                        value={categoryId}
                        onChange={(val) => setCategoryId(val)}
                    />
                    <Select 
                        label="Pilih Dompet"
                        placeholder="Pilih sumber dana..."
                        options={walletsData}
                        value={walletId}
                        onChange={(val) => setWalletId(val)}
                    />
                    <Input 
                        label="Jumlah Transaksi"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={<ArrowsLeftRightIcon size={18} weight="bold" />}
                    />
                    {isRecurring && (
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
                            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Setiap Tanggal</label>
                            <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`h-9 w-full rounded-lg text-xs font-semibold border ${selectedDays.includes(day) ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            <Input label="Batas Tanggal" type="date" value={limitDate} onChange={(e) => setLimitDate(e.target.value)} />
                        </div>
                    )}
                    <Input 
                        label="Deskripsi" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        type="textarea"
                        rows={3}
                    />
                </div>
            </Modal>
        </>
    );
};

export default Transaksi;

