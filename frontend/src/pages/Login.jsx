import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IlustrasiLoginImg from '../assets/IlustrasiLogin.png';
import AuthHeader from '../components/AuthHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import useApi from '../hooks/useApi';

/**
 * Komponen Login untuk aplikasi Kelola Uang (Laeva)
 * Menggunakan standar React Functional Component dengan Tailwind CSS
 */
const Login = () => {
    const navigate = useNavigate();
    const [login, { loading, error }] = useApi();

    // State untuk menangkap input user
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Fungsi handle submit form
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await login('POST', '/otentikasi/masuk', { username, password });

            
            if (response.data && response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            // Redirect ke dashboard
            navigate('/dashboard');
        } catch (err) {
            // Error ditangani oleh useApi (state error)
            console.error("Login gagal:", err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white text-secondary font-sans antialiased">
            
            {/* Kolom Kiri (Bagian Form) */}
            <div className="w-full lg:w-[45%] p-6 lg:p-6 flex flex-col min-h-screen">
                
                {/* Header / Logo */}
                <AuthHeader />

                {/* Kontainer Form (Di-center vertikal) */}
                <div className="flex-grow flex flex-col justify-center w-full max-w-[380px] mx-auto">
                    
                    {/* Judul */}
                    <h1 className="text-[32px] font-semibold mb-1">Login</h1>
                    <p className="text-[14px] mb-8 font-medium">
                        Belum Punya Akun ? <Link to="/register" className="text-primary hover:underline transition-all">Register</Link>
                    </p>

                    {/* Form Input */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input 
                            label="Username"
                            name="username"
                            type="text" 
                            placeholder="Masukkan Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            size="lg"
                            autoComplete="username"
                            required
                        />
                        
                        <Input 
                            label="Password"
                            name="password"
                            type="password" 
                            placeholder="Masukkan Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="lg"
                            autoComplete="current-password"
                            required
                        />

                        <Button 
                            type="submit" 
                            size="lg"
                            isFullWidth
                            className="mt-4"
                        >
                            Login
                        </Button>
                    </form>

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

                {/* Dekorasi Tambahan (Opsional) */}
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[200px] h-[200px] bg-primary opacity-10 rounded-full blur-3xl"></div>

            </div>

        </div>
    );
};

export default Login;
