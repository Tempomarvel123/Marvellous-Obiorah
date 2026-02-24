import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function UploadMaterial() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    file: null as File | null
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    };
    fetchCourses();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return setError('Please select a file');

    setLoading(true);
    setError('');
    setSuccess(false);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('course_id', formData.course_id);
    data.append('file', formData.file);

    try {
      const res = await fetch('/api/materials/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ title: '', course_id: '', file: null });
        setTimeout(() => navigate('/materials'), 2000);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Upload failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100">
          <h1 className="text-2xl font-bold text-zinc-900">Upload Course Material</h1>
          <p className="text-zinc-500">Share resources with your students securely.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-xl text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Material uploaded successfully! Redirecting...</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Material Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Introduction to Algorithms Lecture Notes"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Course</label>
              <select
                required
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.course_title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">File (PDF, DOCX, PPTX - Max 20MB)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors cursor-pointer relative">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                  <div className="flex text-sm text-zinc-600">
                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      {formData.file ? formData.file.name : 'Click to upload a file'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">PDF, DOCX, PPTX up to 20MB</p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  accept=".pdf,.docx,.ppt,.pptx"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload Material'}
          </button>
        </form>
      </div>
    </div>
  );
}
