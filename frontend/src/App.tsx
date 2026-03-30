import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home, LogIn, LayoutDashboard, Database, UserPlus } from 'lucide-react'

// Basic placeholder components
const Login = () => <div className="p-8"><h1>Login Page</h1><p>Welcome! Please sign in.</p></div>
const Dashboard = () => <div className="p-8"><h1>Dashboard</h1><p>Here is your financial overview.</p></div>
const Pemasukan = () => <div className="p-8"><h1>Pemasukan</h1><p>Manage your income.</p></div>
const Register = () => <div className="p-8"><h1>Register</h1><p>Create a new account.</p></div>
const NotFound = () => <div className="p-8"><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p></div>

import { testApi } from './api'

function App() {
  const handleTestApi = async () => {
    try {
      const data = await testApi();
      alert(`API Connection successful! Data: ${JSON.stringify(data)}`);
    } catch (err) {
      alert(`API Connection failed. Is your PHP server running?`);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* Simple Navigation */}
        <nav className="bg-gray-800 p-4 flex gap-6 items-center border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <Home size={20} /> Home
          </Link>
          <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <LogIn size={20} /> Login
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/pemasukan" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <Database size={20} /> Pemasukan
          </Link>
          <Link to="/register" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <UserPlus size={20} /> Register
          </Link>
        </nav>

        {/* Content */}
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={
              <div className="p-8">
                <h1>Home Page</h1>
                <p>Welcome to Kelola Uang.</p>
                <button 
                  onClick={handleTestApi}
                  className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                >
                  Test API Connection
                </button>
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pemasukan" element={<Pemasukan />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
