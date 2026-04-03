/**
 * Komponen Button Atomik.
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'white'
 * - size: 'sm' | 'md' | 'lg'
 * - icon: ReactNode (ikon di depan teks)
 * - isFullWidth: boolean
 */
const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    icon, 
    className = '', 
    isFullWidth = false,
    ...props 
}) => {
    // Definisi Warna/Varian
    const variants = {
        primary: 'bg-primary text-white hover:bg-opacity-90 shadow-sm',
        secondary: 'bg-secondary text-white hover:bg-opacity-90 shadow-sm',
        outline: 'bg-transparent border border-gray-200 text-secondary hover:bg-gray-50',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        white: 'bg-white text-secondary border border-gray-100 hover:bg-gray-50 shadow-sm',
    };

    // Definisi Ukuran
    const sizes = {
        sm: 'px-3 py-1.5 text-[11px] font-semibold rounded-md',
        md: 'px-5 py-2.5 text-[13px] font-medium rounded-lg',
        lg: 'px-6 py-3.5 text-[15px] font-semibold rounded-xl',
    };

    const baseClasses = 'inline-flex items-center justify-center gap-2 transition-all duration-200 outline-none';
    const widthClass = isFullWidth ? 'w-full' : '';

    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
