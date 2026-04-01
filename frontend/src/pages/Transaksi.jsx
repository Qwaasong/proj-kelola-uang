import { useState, useRef, useEffect } from 'react';
import { 
    FunnelIcon, 
    MagnifyingGlassIcon, 
    CaretDownIcon, 
    CaretLeftIcon, 
    CaretRightIcon,
    TrashIcon 
} from '@phosphor-icons/react';
import TransaksiSkeleton from '../components/TransaksiSkeleton';
import TransactionTable from '../components/TransactionTable';
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

    if (isLoading) {
        return <TransaksiSkeleton />;
    }

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <h1 className="text-2xl font-semibold text-secondary">Transaksi</h1>
                <button className="bg-primary text-white text-[13px] px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm">
                    Tambah Transaksi
                </button>
            </div>

            {/* Main Table Container */}
            <div className="px-8 pb-10 w-full max-w-[1450px]">
                <div className="bg-white border border-borderLight rounded-2xl flex flex-col w-full shadow-sm overflow-hidden">
                    
                    {/* Toolbar */}
                    <div className="flex justify-between items-center px-5 py-3 border-b border-borderLight flex-wrap gap-4 bg-white rounded-t-2xl">
                        
                        <div className="flex items-center gap-3">
                            <button className="w-8 h-8 bg-secondary text-white rounded-md flex items-center justify-center hover:bg-opacity-90 transition shadow-sm outline-none">
                                <FunnelIcon size={18} weight="bold" />
                            </button>

                            {selectedRows.length > 0 && (
                                <div className="relative" ref={bulkRef}>
                                    <button 
                                        onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                                        className="h-8 px-3 bg-secondary text-white rounded-md flex items-center justify-center gap-2 hover:bg-opacity-90 transition shadow-sm outline-none text-[12px] font-semibold"
                                    >
                                        <span>Bulk Action</span>
                                        <span className="text-white px-1.5 py-[2px] rounded text-[10px]">{selectedRows.length}</span>
                                        <CaretDownIcon size={12} weight="bold" className={`text-gray-400 transition-transform ${isBulkDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isBulkDropdownOpen && (
                                        <div className="absolute top-10 left-0 w-44 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-20 animate-[fadeIn_0.15s_ease-out]">
                                            <button 
                                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#E74C3C] hover:bg-red-50 transition-colors flex items-center gap-2 shadow-sm"
                                                onClick={handleDeleteBulk}
                                            >
                                                <TrashIcon size={16} weight="bold" /> Delete Selected
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center border border-borderLight rounded-lg px-3 py-1.5 w-full sm:w-[320px] bg-white transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-[#408A71]/30 shadow-sm">
                            <MagnifyingGlassIcon size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                className="outline-none text-[13px] w-full text-secondary placeholder-gray-400 bg-transparent" 
                                placeholder="Cari transaksi..."
                            />
                        </div>
                    </div>

                    <TransactionTable 
                        data={initialData}
                        selectedRows={selectedRows}
                        onToggleSelect={handleToggleSelectRow}
                        onSelectAll={handleSelectAll}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-t border-borderLight gap-4 bg-white rounded-b-2xl">
                        <span className="text-[12px] text-gray-500 font-medium">
                            Menampilkan 1 - 5 dari 5 hasil
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button className="w-7 h-7 bg-secondary text-white rounded flex items-center justify-center hover:bg-opacity-90 transition">
                                <CaretLeftIcon size={14} weight="bold" />
                            </button>
                            <button className="w-7 h-7 bg-secondary text-white rounded flex items-center justify-center text-[12px] font-medium transition cursor-default">
                                1
                            </button>
                            <button className="w-7 h-7 bg-secondary text-white rounded flex items-center justify-center hover:bg-opacity-90 transition">
                                <CaretRightIcon size={14} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Transaksi;
