
import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Save, RefreshCw, BarChart2 } from 'lucide-react';
import Toast from '../../components/Toast';

const StatsManager: React.FC = () => {
  const { stats, updateStats, loading } = useContent();
  const [formState, setFormState] = useState(stats);
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    setFormState(stats);
  }, [stats]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStats(formState);
      setIsSaved(true);
      setToast({ show: true, message: 'Statistik berhasil diperbarui!', type: 'success' });
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setToast({ show: true, message: 'Gagal menyimpan statistik ke database!', type: 'error' });
    }
  };

  const handleReset = () => {
    setFormState(stats);
    setIsSaved(false);
  };

  return (
    <div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <div className="flex items-center mb-6">
        <div className="p-2 bg-sea-100 rounded-lg mr-3 text-sea-600">
          <BarChart2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Statistik</h1>
          <p className="text-sm text-slate-500">Update angka statistik yang tampil pada halaman beranda.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Mahasiswa Aktif</label>
                <input
                  type="text"
                  name="students"
                  value={formState.students}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="e.g. 450+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Mata Kuliah</label>
                <input
                  type="text"
                  name="courses"
                  value={formState.courses}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="e.g. 48"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Penghargaan</label>
                <input
                  type="text"
                  name="awards"
                  value={formState.awards}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="e.g. 25+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tingkat Serapan Kerja</label>
                <input
                  type="text"
                  name="employment"
                  value={formState.employment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="e.g. 92%"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center text-slate-500 hover:text-slate-700 text-sm font-medium transition"
              >
                <RefreshCw size={16} className="mr-2" /> Reset ke data tersimpan
              </button>

              <button
                type="submit"
                className="px-8 py-2.5 bg-sea-600 text-white font-bold rounded-lg shadow-lg shadow-sea-600/20 hover:bg-sea-700 transition flex items-center"
              >
                <Save size={18} className="mr-2" />
                {isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <strong>Catatan:</strong> Perubahan yang Anda simpan akan langsung terlihat pada halaman depan website.
      </div>
    </div>
  );
};

export default StatsManager;
