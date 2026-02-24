import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UserPlus, BookPlus, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseData, setCourseData] = useState({
    course_code: '',
    course_title: '',
    level: '100',
    semester: 'First',
    lecturer_id: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Creating course...' });
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Course created successfully!' });
        setCourseData({ course_code: '', course_title: '', level: '100', semester: 'First', lecturer_id: '' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.message || 'Failed to create course' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong' });
    }
  };

  const lecturers = users.filter(u => u.role === 'lecturer');

  if (loading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-zinc-500 mt-1">Manage users and system configuration.</p>
        </div>
        <button
          onClick={() => setShowCreateCourse(!showCreateCourse)}
          className="flex items-center space-x-2 px-4 py-2 bg-brand text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-black hover:text-brand transition-all"
        >
          <BookPlus className="w-5 h-5" />
          <span>{showCreateCourse ? 'View Users' : 'Create Course'}</span>
        </button>
      </div>

      {showCreateCourse ? (
        <div className="max-w-2xl bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Create New Course</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            {status.message && (
              <div className={`p-4 rounded-xl text-sm flex items-center gap-2 font-bold uppercase tracking-tight ${
                status.type === 'success' ? 'bg-brand text-black border-2 border-black' : 
                status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-black text-brand border border-brand'
              }`}>
                {status.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {status.message}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="CSC 101"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  value={courseData.course_code}
                  onChange={(e) => setCourseData({ ...courseData, course_code: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Lecturer</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  value={courseData.lecturer_id}
                  onChange={(e) => setCourseData({ ...courseData, lecturer_id: e.target.value })}
                >
                  <option value="">Select Lecturer</option>
                  {lecturers.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Course Title</label>
              <input
                type="text"
                required
                placeholder="Introduction to Computer Science"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                value={courseData.course_title}
                onChange={(e) => setCourseData({ ...courseData, course_title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Level</label>
                <select
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  value={courseData.level}
                  onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Semester</label>
                <select
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  value={courseData.semester}
                  onChange={(e) => setCourseData({ ...courseData, semester: e.target.value })}
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand text-black font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-brand transition-all"
            >
              Create Course
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">{u.name}</td>
                  <td className="px-6 py-4 text-zinc-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-black text-brand border border-brand' :
                      u.role === 'lecturer' ? 'bg-brand text-black' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
