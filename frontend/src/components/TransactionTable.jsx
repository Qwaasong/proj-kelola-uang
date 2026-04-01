import { useState, useEffect, useRef } from 'react';
import { 
    DotsThreeVerticalIcon, 
    PencilSimpleIcon, 
    TrashIcon 
} from '@phosphor-icons/react';

/**
 * Komponen Baris Tabel Transaksi — mengelola dropdown aksi internal.
 */
const TransactionRow = ({ index, row, totalRows, isSelected, onToggleSelect }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown klik diluar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Logika Drop-Up: Jika ini adalah baris ke-1 atau ke-2 terakhir, menu akan muncul ke atas
    const isNearBottom = index >= totalRows - 2;

    return (
        <tr className={`border-b border-borderLight transition-colors last:border-0 ${isSelected ? 'bg-[#F0F7F4]/40' : 'hover:bg-gray-50/70'}`}>
            
            {/* Checkbox Kolom */}
            <td className="py-3.5 pl-5 pr-2">
                <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="w-[15px] h-[15px] rounded border-gray-300 accent-primary cursor-pointer"
                />
            </td>
            
            <td className="py-3.5 px-4 w-[60px]">{index + 1}</td>
            <td className="py-3.5 px-6 font-medium">{row.type}</td>
            <td className="py-3.5 px-6">{row.wallet}</td>
            <td className="py-3.5 px-6">{row.amount}</td>
            <td className="py-3.5 px-6 text-gray-500 whitespace-nowrap">{row.date}</td>
            
            {/* Kolom Aksi */}
            <td className="py-3.5 px-6 text-center relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors mx-auto ${isDropdownOpen ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                    <DotsThreeVerticalIcon size={20} weight="bold" className="text-gray-500" />
                </button>

                {/* Dropdown Menu (Posisi Dinamis: Top / Bottom) */}
                {isDropdownOpen && (
                    <div className={`absolute right-8 w-32 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-[50] animate-[fadeIn_0.15s_ease-out] ${isNearBottom ? 'bottom-8' : 'top-10'}`}>
                        <button 
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-secondary hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => {
                                console.log('Edit row:', row);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <PencilSimpleIcon size={16} className="text-gray-400" /> Edit
                        </button>
                        <button 
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#E74C3C] hover:bg-red-50 transition-colors flex items-center gap-2"
                            onClick={() => {
                                console.log('Delete row:', row);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <TrashIcon size={16} weight="bold" /> Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

/**
 * Komponen utama Tabel Transaksi.
 * Bertanggung jawab merender daftar transaksi dengan fitur checkbox.
 */
const TransactionTable = ({ data, selectedRows, onToggleSelect, onSelectAll }) => {
    return (
        <div className="w-full overflow-x-auto relative">
            <table className="w-full min-w-[700px] text-left">
                
                {/* Header Tabel */}
                <thead className="bg-bgMain text-[12px] text-gray-400 uppercase border-b border-borderLight font-bold">
                    <tr>
                        <th className="py-3 pl-5 pr-2 w-[40px]">
                            <input 
                                type="checkbox" 
                                checked={data.length > 0 && selectedRows.length === data.length}
                                onChange={onSelectAll}
                                className="w-[15px] h-[15px] rounded border-gray-300 accent-primary cursor-pointer"
                            />
                        </th>
                        <th className="py-3 px-4 font-bold w-[60px]">No</th>
                        <th className="py-3 px-6 font-bold">Tipe</th>
                        <th className="py-3 px-6 font-bold">Dompet</th>
                        <th className="py-3 px-6 font-bold">Jumlah</th>
                        <th className="py-3 px-6 font-bold">Tanggal</th>
                        <th className="py-3 px-6 font-bold w-[50px]"></th>
                    </tr>
                </thead>
                
                {/* Body Tabel */}
                <tbody className="text-[13px] text-secondary bg-white">
                    {data.map((row, index) => (
                        <TransactionRow 
                            key={row.id} 
                            index={index} 
                            row={row} 
                            totalRows={data.length}
                            isSelected={selectedRows.includes(row.id)}
                            onToggleSelect={onToggleSelect}
                        />
                    ))}
                </tbody>
                
            </table>

            {/* Empty State sederhana jika tidak ada data */}
            {data.length === 0 && (
                <div className="py-20 text-center text-gray-400 bg-white">
                    Tidak ada transaksi ditemukan.
                </div>
            )}
        </div>
    );
};

export default TransactionTable;
