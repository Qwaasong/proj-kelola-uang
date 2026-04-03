import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';

/**
 * Komponen Modal Reusable (Filament Style).
 * Menggunakan React Portals untuk memastikan modal berada di atas seluruh elemen.
 * 
 * Props:
 * - isOpen: boolean — Status terbuka/tertutupnya modal.
 * - onClose: function — Callback saat modal ditutup (tombol close, backdrop, atau ESC).
 * - title: string — Judul di bagian header modal.
 * - children: ReactNode — Konten utama modal.
 * - footer: ReactNode — Elemen opsional di bagian bawah (biasanya tombol aksi).
 * - size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' — Lebar maksimum modal.
 * - closeOnBackdrop: boolean — Apakah modal ditutup saat backdrop diklik (default: true).
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
}) => {
    // Definisi ukuran modal
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
    };

    // Fungsi untuk menangani penutupan dengan tombol ESC
    const handleEsc = useCallback((event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // Side effect untuk mengunci scroll body dan mendaftarkan event ESC
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, handleEsc]);

    // Jika modal tidak terbuka, jangan render apa pun
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Backdrop dengan efek blur (Glassmorphism) */}
            <div 
                className="fixed inset-0 bg-secondary/30 backdrop-blur-[4px] transition-opacity duration-300" 
                onClick={closeOnBackdrop ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div 
                className={`
                    relative w-full ${sizes[size]} 
                    bg-white rounded-2xl shadow-2xl 
                    ring-1 ring-gray-950/5 
                    transform transition-all duration-300 scale-100 opacity-100
                    flex flex-col max-h-[90vh]
                `}
                role="dialog"
                aria-modal="true"
            >
                
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-secondary leading-6">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="
                            flex items-center justify-center w-8 h-8 
                            rounded-lg text-gray-400 hover:text-red-500 
                            hover:bg-red-50 transition-all duration-200
                        "
                        aria-label="Close modal"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Body Konten (Scrollable jika terlalu panjang) */}
                <div className="px-6 py-6 overflow-y-auto text-sm text-gray-600 leading-relaxed custom-scrollbar">
                    {children}
                </div>

                {/* Footer Modal (Opsional) */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-[#FAFAFA]/50 rounded-b-2xl flex-shrink-0">
                        {footer}
                    </div>
                )}

            </div>
        </div>,
        document.body
    );
};

export default Modal;
