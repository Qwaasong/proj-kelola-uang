import { Navigate } from 'react-router-dom';

/**
 * Komponen High-Order untuk moproteksi route yang membutuhkan otentikasi.
 * Mengecek keberadaan 'auth_token' di localStorage.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        // Jika tidak ada token, arahkan kembali ke login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
