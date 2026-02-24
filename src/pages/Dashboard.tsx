import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, FileText, PlusCircle, ArrowRight, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ users: 0, courses: 0, materials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we'd have a stats endpoint
        const [usersRes, coursesRes, materialsRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/materials', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (usersRes.ok && coursesRes.ok && materialsRes.ok) {
          const users = await usersRes.json();
          const courses = await coursesRes.json();
          const materials = await materialsRes.json();
          setStats({
            users: users.length,
            courses: courses.length,
            materials: materials.length
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-zinc-500 mt-1">Here's what's happening in the Secure Course Vault.</p>
      </div>

      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand/10 rounded-xl text-black">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">Total Users</h3>
            <p className="text-2xl font-bold text-zinc-900">{stats.users}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand/10 rounded-xl text-black">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">Total Courses</h3>
            <p className="text-2xl font-bold text-zinc-900">{stats.courses}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand/10 rounded-xl text-black">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">Total Materials</h3>
            <p className="text-2xl font-bold text-zinc-900">{stats.materials}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {user?.role === 'lecturer' && (
              <Link
                to="/upload"
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <PlusCircle className="w-5 h-5 text-brand" />
                  </div>
                  <span className="font-medium text-zinc-900">Upload New Material</span>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-brand transition-colors" />
              </Link>
            )}
            <Link
              to="/materials"
              className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Search className="w-5 h-5 text-brand" />
                </div>
                <span className="font-medium text-zinc-900">Browse Materials</span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-brand transition-colors" />
            </Link>
          </div>
        </div>

        <div className="bg-black p-8 rounded-2xl shadow-lg text-white relative overflow-hidden border-2 border-brand">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Secure Academic Storage</h2>
            <p className="text-zinc-400 mb-6">
              All materials are protected and accessible only to authorized students and staff.
            </p>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-brand text-black rounded-full text-xs font-bold uppercase tracking-wider">PDF Support</span>
              <span className="px-3 py-1 bg-brand text-black rounded-full text-xs font-bold uppercase tracking-wider">DOCX Support</span>
              <span className="px-3 py-1 bg-brand text-black rounded-full text-xs font-bold uppercase tracking-wider">PPTX Support</span>
            </div>
          </div>
          <Shield className="absolute -right-8 -bottom-8 w-48 h-48 text-brand/10" />
        </div>
      </div>
    </div>
  );
}
