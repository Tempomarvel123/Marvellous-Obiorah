import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Shield, User, Upload, Search, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-brand" />
              <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase">SecureVault</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-1 text-zinc-600 hover:text-black hover:bg-brand/10 px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-tight transition-all">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center space-x-1 text-zinc-600 hover:text-black hover:bg-brand/10 px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-tight transition-all">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {user.role === 'lecturer' && (
              <Link to="/upload" className="flex items-center space-x-1 text-zinc-600 hover:text-black hover:bg-brand/10 px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-tight transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Link>
            )}

            {user.role === 'student' && (
              <Link to="/materials" className="flex items-center space-x-1 text-zinc-600 hover:text-black hover:bg-brand/10 px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-tight transition-all">
                <Search className="w-4 h-4" />
                <span>Materials</span>
              </Link>
            )}

            <div className="ml-4 flex items-center space-x-4 border-l pl-4 border-zinc-200">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-zinc-900">{user.name}</span>
                <span className="text-xs text-zinc-500 capitalize">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
