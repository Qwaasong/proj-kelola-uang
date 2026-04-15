const Input = ({ 
    label, 
    icon, 
    error, 
    size = 'md', 
    className = '', 
    ...props 
}) => {
    const inputSizes = {
        md: 'px-3 py-2 text-sm rounded-lg min-h-[40px]',
        lg: 'px-4 py-3 text-base rounded-xl min-h-[48px]',
    };

    const baseClasses = `
        w-full bg-white text-gray-950 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
        transition-all duration-200
        ring-1 
        placeholder:text-gray-400 
        outline-none
        focus:ring-2 focus:ring-primary
        hover:ring-gray-950/20
    `;

    // State Error (Filament menggunakan ring-red-600)
    const errorClasses = error 
        ? 'ring-red-600 focus:ring-red-600' 
        : 'ring-gray-950/10';

    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label className="text-sm font-medium leading-6 text-gray-950 px-1">
                    {label}
                </label>
            )}
            
            <div className="relative flex items-center group">
                {icon && (
                    <div className="absolute left-3 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                        {/* Ukuran ikon disesuaikan agar proporsional */}
                        {icon}
                    </div>
                )}
                
                {props.type === 'textarea' ? (
                    <textarea 
                        className={`
                            ${baseClasses} 
                            ${inputSizes[size]} 
                            ${errorClasses} 
                            ${icon ? 'pl-10' : ''}
                            py-3 min-h-[100px] resize-none
                        `}
                        {...props}
                    />
                ) : (
                    <input 
                        className={`
                            ${baseClasses} 
                            ${inputSizes[size]} 
                            ${errorClasses} 
                            ${icon ? 'pl-10' : ''}
                        `}  
                        {...(props.type === 'number' ? { 
                            min: '0',
                            onKeyDown: (e) => {
                                if (['-', 'e', 'E'].includes(e.key)) e.preventDefault();
                                if (props.onKeyDown) props.onKeyDown(e);
                            }
                        } : {})}
                        {...props}
                    />
                )}
            </div>
            
            {error && (
                <span className="text-[11px] text-red-600 px-1">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;