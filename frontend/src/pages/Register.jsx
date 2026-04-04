import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IlustrasiLoginImg from '../assets/IlustrasiLogin.png';
import AuthHeader from '../components/AuthHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import useApi from '../hooks/useApi';

/**
 * Komponen Register untuk aplikasi Kelola Uang (Laeva)
 * Menggunakan standar React Functional Component dengan Tailwind CSS
 */
const Register = () => {
    const navigate = useNavigate();
    const [register, { loading, error }] = useApi();

    // State untuk menangkap input user
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * Fungsi handle submit form
     * Melakukan API call pendaftaran ke backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Password dan Konfirmasi Password tidak cocok!");
            return;
        }

        try {
            await register('POST', '/otentikasi/daftar', { 
                username, 
                password, 
                confirm_password: confirmPassword 
            });
            
            alert("Registrasi berhasil! Silakan login.");
            navigate('/login');
        } catch (err) {
            console.error("Registrasi gagal:", err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white text-secondary font-sans antialiased">
            
            {/* Kolom Kiri (Bagian Form) */}
            <div className="w-full lg:w-[45%] p-6 lg:p-6 flex flex-col min-h-screen">
                
                {/* Header / Logo */}
                <AuthHeader />

                {/* Kontainer Form */}
                <div className="flex-grow flex flex-col justify-center w-full max-w-[380px] mx-auto py-8">
                    
                    {/* Judul */}
                    <h1 className="text-[32px] font-semibold mb-1">Register</h1>
                    <p className="text-[14px] mb-8 font-medium">
                        Sudah Punya Akun ? <Link to="/login" className="text-primary hover:underline transition-all">Login</Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            label="Username"
                            type="text" 
                            placeholder="Masukkan Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            size="lg"
                            required
                        />
                        
                        <Input 
                            label="Password"
                            type="password" 
                            placeholder="Masukkan Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="lg"
                            required
                        />

                        <Input 
                            label="Konfirmasi Password"
                            type="password" 
                            placeholder="Konfirmasi Password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            size="lg"
                            required
                        />

                        <Button 
                            type="submit" 
                            size="lg"
                            isFullWidth
                            className="mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>

                    {/* Menampilkan pesan error jika ada */}
                    {error && (
                        <p className="text-red-500 text-sm mt-4 text-center font-medium">
                            {error.message}
                        </p>
                    )}

                    {/* Teks Footer */}
                    <p className="text-center text-[12px] mt-8 font-medium px-4">
                        I agree with Laeva's <a href="#" className="text-primary hover:underline">Privacy</a> and <a href="#" className="text-primary hover:underline">Terms of Services</a>
                    </p>

                </div>
            </div>

            {/* Kolom Kanan (Bagian Ilustrasi) */}
            <div className="hidden lg:flex w-[55%] items-center justify-center p-8 relative overflow-hidden bg-white border-l border-gray-100">
                
                {/* Ilustrasi SVG */}
                <img 
                    src={IlustrasiLoginImg} 
                    alt="Ilustrasi Login" 
                    fetchPriority='high'
                    className="w-full max-w-[500px] h-auto object-contain z-10"
                />

                {/* Dekorasi Tambahan */}
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[200px] h-[200px] bg-primary opacity-10 rounded-full blur-3xl"></div>
            </div>

        </div>
    );
};

export default Register;
