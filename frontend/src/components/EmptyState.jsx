import Button from './Button';
import EmptyIllustration from '../assets/EmptyState.png';

/**
 * Komponen Reusable Empty State.
 * Menampilkan ilustrasi, judul, deskripsi opsional, dan tombol aksi.
 */
const EmptyState = ({ 
    title = "Data Belum Tersedia", 
    description, 
    buttonText, 
    onButtonClick,
    icon,
    className = ""
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 w-full animate-in fade-in zoom-in duration-700 ${className}`}>
            
            {/* Ilustrasi */}
            <div className="relative w-64 h-64 sm:w-[420px] sm:h-[280px] mb-4">
                <img 
                    src={EmptyIllustration} 
                    alt="Tidak ada data" 
                    className="w-full h-full object-contain drop-shadow-sm select-none"
                />
            </div>
            
            {/* Judul */}
            <h2 className="text-[20px] sm:text-[24px] font-bold text-secondary text-center max-w-lg leading-snug mb-8 font-sans">
                {title}
            </h2>
            
            {/* Deskripsi (Opsional) */}
            {description && (
                <p className="text-[14px] text-gray-500 text-center max-w-sm mb-8 -mt-4 font-medium">
                    {description}
                </p>
            )}

            {/* Tombol Aksi (Opsional) */}
            {buttonText && (
                <Button 
                    size="md" 
                    variant="primary" 
                    onClick={onButtonClick}
                    icon={icon}
                    className="px-8 py-3 shadow-md hover:shadow-lg transform active:scale-95 transition-all text-[14px] font-semibold"
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
