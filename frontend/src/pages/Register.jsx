import { useState } from 'react';
import { Link } from 'react-router-dom';
import IlustrasiLoginImg from '../assets/IlustrasiLogin.png';
import AuthHeader from '../components/AuthHeader';

/**
 * Komponen Register untuk aplikasi Kelola Uang (Laeva)
 * Menggunakan standar React Functional Component dengan Tailwind CSS
 */
const Register = () => {
    // State untuk menangkap input user
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * Fungsi handle submit form
     * Di sini adalah tempat untuk melakukan API call pendaftaran nantinya
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Password dan Konfirmasi Password tidak cocok!");
            return;
        }

        // Logika API Call (Placeholder)
        console.log("Memulai proses registrasi untuk:", { username, password });
        
        alert(`Register button clicked for user: ${username}`);
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

                    {/* Form Input */}
                    <form onSubmit={handleSubmit}>
                        {/* Input Username */}
                        <div className="mb-4">
                            <label className="block text-[13px] mb-2 font-medium">Username</label>
                            <input 
                                type="text" 
                                placeholder="Masukkan Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-inputbg rounded-md px-4 py-3 text-[14px] placeholder-gray-400 outline-none focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                            <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">Disarankan Menggunakan Huruf dan Angka</span>
                        </div>
                        
                        {/* Input Password */}
                        <div className="mb-4">
                            <label className="block text-[13px] mb-2 font-medium">Password</label>
                            <input 
                                type="password" 
                                placeholder="Masukkan Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-inputbg rounded-md px-4 py-3 text-[14px] placeholder-gray-400 outline-none focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                            <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">Disarankan Menggunakan Huruf dan Angka</span>
                        </div>

                        {/* Input Konfirmasi Password */}
                        <div className="mb-6">
                            <label className="block text-[13px] mb-2 font-medium">Konfirmasi Password</label>
                            <input 
                                type="password" 
                                placeholder="Masukkan Password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-inputbg rounded-md px-4 py-3 text-[14px] placeholder-gray-400 outline-none focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                            <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">Disarankan Menggunakan Huruf dan Angka</span>
                        </div>

                        {/* Tombol Register */}
                        <button 
                            type="submit" 
                            className="w-full bg-primary text-white rounded-md py-3 text-[15px] font-medium hover:bg-opacity-90 transition-all mt-2"
                        >
                            Register
                        </button>
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

                {/* Dekorasi Tambahan */}
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[200px] h-[200px] bg-primary opacity-10 rounded-full blur-3xl"></div>
            </div>

        </div>
    );
};

export default Register;
