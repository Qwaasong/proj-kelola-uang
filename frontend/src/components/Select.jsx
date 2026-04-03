import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { CaretDown, MagnifyingGlass, Check } from '@phosphor-icons/react';

/**
 * Komponen Select Kustom (Searchable & Modern SaaS Style).
 * Menggunakan React Portals untuk menghindari masalah overflow pada modal.
 * 
 * Props:
 * - label: string — Label di atas input.
 * - options: Array<{id, name, icon}> — Daftar pilihan.
 * - value: any — ID pilihan yang terpilih.
 * - onChange: function — Callback saat pilihan berubah.
 * - placeholder: string — Teks saat belum ada pilihan.
 * - icon: ReactNode — Ikon di sisi kiri input utama.
 * - error: string — Pesan kesalahan (opsional).
 */
const Select = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Pilih salah satu...',
    icon: MainIcon,
    error,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);
    const triggerRef = useRef(null);

    // Ambil objek yang terpilih berdasarkan value (id)
    const selectedOption = useMemo(() => 
        options.find(opt => opt.id === value), 
        [options, value]
    );

    // Filter opsi berdasarkan query pencarian
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        return options.filter(opt => 
            opt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Fungsi untuk menghitung posisi dropdown secara presisi
    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    // Sinkronisasi posisi dengan portal saat dibuka
    useLayoutEffect(() => {
        if (isOpen) {
            updateCoords();
        }
    }, [isOpen]);

    // Update posisi saat resize atau scroll global
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true); // capture true utk modal scroll
        }
        return () => {
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    // Tutup dropdown jika klik di luar komponen
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Pastikan tidak menutup jika klik ada di dalam portal dropdown
                const portalDropdown = document.getElementById('select-portal-dropdown');
                if (portalDropdown && portalDropdown.contains(event.target)) return;
                
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset pencarian saat dropdown ditutup
    useEffect(() => {
        if (!isOpen) setSearchQuery('');
    }, [isOpen]);

    // Fungsi toggle yang menghitung posisi terlebih dahulu untuk menghindari flickering
    const handleToggle = () => {
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={`flex flex-col gap-2 w-full relative ${className}`} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium leading-6 text-gray-950 px-1">
                    {label}
                </label>
            )}

            {/* Trigger Dropdown */}
            <div 
                ref={triggerRef}
                onClick={handleToggle}
                className={`
                    relative flex items-center w-full bg-white text-gray-950 
                    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
                    transition-all duration-200 cursor-pointer
                    ring-1 ${isOpen ? 'ring-2 ring-primary' : (error ? 'ring-red-600' : 'ring-gray-950/10')}
                    rounded-lg min-h-[42px] px-3 gap-3
                    hover:ring-gray-950/20
                `}
            >
                {MainIcon && (
                    <div className="text-gray-400">
                        {MainIcon}
                    </div>
                )}

                <div className={`flex-grow text-sm ${!selectedOption ? 'text-gray-400' : 'text-secondary font-medium'}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </div>

                <CaretDown 
                    size={16} 
                    weight="bold" 
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </div>

            {/* Panel Dropdown (Rendered via Portal to the body) */}
            {isOpen && coords.width > 0 && createPortal(
                <div 
                    id="select-portal-dropdown"
                    style={{
                        position: 'absolute',
                        top: `${coords.top + 6}px`,
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                        zIndex: 9999,
                    }}
                    className="
                        bg-white rounded-xl shadow-2xl ring-1 ring-gray-950/5
                        overflow-hidden animate-in fade-in zoom-in-95 duration-100
                    "
                >
                    {/* Input Pencarian */}
                    <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative flex items-center">
                            <MagnifyingGlass className="absolute left-3 text-gray-400" size={14} weight="bold" />
                            <input 
                                type="text"
                                className="
                                    w-full pl-9 pr-3 py-2 text-[13px] bg-white border border-gray-200 
                                    rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                    placeholder:text-gray-400
                                "
                                placeholder="Cari..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Daftar Opsi */}
                    <div className="max-h-[220px] overflow-y-auto py-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = option.id === value;
                                const IconComp = option.icon;

                                return (
                                    <div
                                        key={option.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(option.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 mx-1 my-0.5 rounded-lg
                                            cursor-pointer transition-all duration-150 text-sm
                                            ${isSelected 
                                                ? 'bg-primary text-white' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            {IconComp && <IconComp size={18} weight={isSelected ? 'fill' : 'bold'} />}
                                        </div>
                                        <span className="flex-grow font-medium leading-none">
                                            {option.name}
                                        </span>
                                        {isSelected && <Check size={14} weight="bold" className="text-white" />}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-400 text-sm italic">
                                Tidak ada hasil ditemukan
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {error && (
                <span className="text-[11px] text-red-600 px-1 mt-1 font-medium">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;
