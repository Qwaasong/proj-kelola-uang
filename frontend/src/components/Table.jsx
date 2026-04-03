import { useState, useEffect, useRef } from 'react';
import { DotsThreeVerticalIcon} from '@phosphor-icons/react';

/**
 * Komponen Baris Tabel Generik.
 */
const TableRow = ({ 
    index, 
    row, 
    columns, 
    totalRows, 
    isSelected, 
    onToggleSelect,
    actions 
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isNearBottom = index >= totalRows - 2;

    return (
        <tr className={`border-b border-gray-200 transition-colors last:border-0 ${isSelected ? 'bg-[#F0F7F4]/40' : 'hover:bg-gray-50/70'}`}>
            
            {/* Checkbox Column */}
            {onToggleSelect && (
                <td className="py-4 pl-5 pr-2">
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => onToggleSelect(row.id)}
                        className="w-[15px] h-[15px] rounded border-gray-300 accent-primary cursor-pointer shadow-sm"
                    />
                </td>
            )}
            
            <td className="py-4 px-4 w-[60px] text-gray-500">{index + 1}</td>

            {columns.map((col) => (
                <td 
                    key={col.key} 
                    className={`py-4 px-6 text-[13px] ${col.className || ''} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                    style={{ textAlign: col.align || 'left' }}
                >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
            ))}
            
            {/* Action Column */}
            {actions && (
                <td className="py-4 px-6 text-center relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto ${isDropdownOpen ? 'bg-gray-100 ring-1 ring-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        <DotsThreeVerticalIcon size={20} weight="bold" className="text-gray-500" />
                    </button>

                    {isDropdownOpen && (
                        <div className={`absolute right-10 w-40 bg-white rounded-xl shadow-lg ring-1 ring-gray-950/5 py-1.5 z-[50] animate-[fadeIn_0.15s_ease-out] ${isNearBottom ? 'bottom-10' : 'top-10'}`}>
                            {actions.map((action, idx) => (
                                <button 
                                    key={idx}
                                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors flex items-center gap-2 ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => {
                                        action.onClick(row);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {action.icon && <span>{action.icon}</span>}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </td>
            )}
        </tr>
    );
};

/**
 * Komponen Tabel Generik (Table.jsx).
 * Menerima props:
 * - columns: array config kolom (label, key, align, render, hideOnMobile, className)
 * - data: array data baris
 * - selectedRows: array id terpilih (opsional)
 * - onToggleSelect: fn(id) (opsional)
 * - onSelectAll: fn(e) (opsional)
 * - actions: array action ({ label, icon, onClick, variant })
 * - emptyMessage: string (opsional)
 */
const Table = ({ 
    columns, 
    data, 
    selectedRows = [], 
    onToggleSelect, 
    onSelectAll,
    actions,
    emptyMessage = "Tidak ada data ditemukan." 
}) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
                
                {/* Header Tabel Adaptive */}
                <thead className="bg-[#FAFAFA] text-[11px] text-gray-400 uppercase font-bold">
                    <tr>
                        {onSelectAll && (
                            <th className="py-3 pl-5 pr-2 w-[40px] border-b border-gray-200">
                                <input 
                                    type="checkbox" 
                                    checked={data.length > 0 && selectedRows.length === data.length}
                                    onChange={onSelectAll}
                                    className="w-[15px] h-[15px] rounded border-gray-300 accent-primary cursor-pointer shadow-sm"
                                />
                            </th>
                        )}
                        <th className="py-3 px-4 w-[60px] border-b border-gray-200">No</th>
                        
                        {columns.map((col) => (
                            <th 
                                key={col.key} 
                                className={`py-3 px-6 border-b border-gray-200 tracking-wider ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                                style={{ textAlign: col.align || 'left', width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                        
                        {actions && <th className="py-3 px-6 border-b border-gray-100 w-[50px]"></th>}
                    </tr>
                </thead>
                
                <tbody className="bg-white">
                    {data.map((row, index) => (
                        <TableRow 
                            key={row.id} 
                            index={index} 
                            row={row} 
                            columns={columns}
                            totalRows={data.length}
                            isSelected={selectedRows.includes(row.id)}
                            onToggleSelect={onToggleSelect}
                            actions={actions}
                        />
                    ))}
                </tbody>
            </table>

            {data.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-[14px] text-gray-400 font-medium">
                        {emptyMessage}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Table;
