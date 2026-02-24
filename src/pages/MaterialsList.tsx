import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Download, FileText, Filter, Calendar, Layers, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function MaterialsList() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ level: '', semester: '' });

  const fetchMaterials = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('course_code', search);
    if (filters.level) params.append('level', filters.level);
    if (filters.semester) params.append('semester', filters.semester);

    try {
      const res = await fetch(`/api/materials?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (err) {
      console.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [token]);

  const handleDownload = async (filename: string, title: string) => {
    try {
      const res = await fetch(`/api/materials/download/${filename}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = title + '.' + filename.split('.').pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Download failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Course Materials</h1>
          <p className="text-zinc-500 mt-1">Access and download your academic resources.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by course code..."
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMaterials()}
            />
          </div>
          <button
            onClick={fetchMaterials}
            className="px-4 py-2 bg-brand text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-black hover:text-brand transition-all"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Level</label>
                <select
                  className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                >
                  <option value="">All Levels</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Semester</label>
                <select
                  className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                  value={filters.semester}
                  onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                >
                  <option value="">All Semesters</option>
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </div>
              <button
                onClick={fetchMaterials}
                className="w-full py-2 border-2 border-brand text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-brand transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((material) => (
                <div key={material.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-brand transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600 group-hover:bg-brand/10 group-hover:text-black transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <button
                      onClick={() => handleDownload(material.file_path, material.title)}
                      className="p-2 text-zinc-400 hover:text-brand transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-1 line-clamp-1">{material.title}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{material.course_code} - {material.course_title}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md">
                      <Layers className="w-3 h-3" /> {material.level}L
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md">
                      <Calendar className="w-3 h-3" /> {material.semester}
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">By {material.lecturer_name}</span>
                    <span className="text-xs text-zinc-400">{format(new Date(material.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center">
              <div className="mx-auto w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No materials found</h3>
              <p className="text-zinc-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
