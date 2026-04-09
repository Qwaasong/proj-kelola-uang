import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

/**
 * Provider untuk mengelola state loading global.
 * Menggunakan counter agar beberapa request API yang berjalan bersamaan 
 * tidak mematikan loading secara prematur.
 */
export const LoadingProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);

    const startLoading = useCallback(() => {
        setLoadingCount(prev => prev + 1);
    }, []);

    const stopLoading = useCallback(() => {
        setLoadingCount(prev => Math.max(0, prev - 1));
    }, []);

    const isGlobalLoading = loadingCount > 0;

    return (
        <LoadingContext.Provider value={{ isGlobalLoading, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useGlobalLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useGlobalLoading must be used within a LoadingProvider');
    }
    return context;
};
