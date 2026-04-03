import { useState, useRef, useEffect } from 'react';
import { 
    ArrowsLeftRightIcon,
    FunnelIcon, 
    MagnifyingGlassIcon, 
    CaretDownIcon, 
    CaretLeftIcon, 
    CaretRightIcon,
    TrashIcon 
} from '@phosphor-icons/react';
import TransaksiSkeleton from '../components/TransaksiSkeleton';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import useFirstLoad from '../hooks/useFirstLoad';

// --- Data Dummy Transaksi ---
const initialData = [
    { id: 1, type: 'Pemasukan', wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
    { id: 2, type: 'Pemasukan', wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
    { id: 3, type: 'Pemasukan', wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
    { id: 4, type: 'Pemasukan', wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
    { id: 5, type: 'Pemasukan', wallet: 'BCA', amount: '120.000', date: '30 Maret 2026' },
];

/**
 * Halaman Transaksi — menampilkan daftar semua transaksi masuk/keluar.
 * Sidebar dan layout utama dikelola oleh App.jsx.
 */
const Transaksi = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
    const bulkRef = useRef(null);

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
                <Button size="md">
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
                        actions={actions}
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
        </>
    );
};

export default Transaksi;
