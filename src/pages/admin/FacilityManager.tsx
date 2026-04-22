
import React, { useState } from 'react';
import { useFacilities } from '../../context/FacilityContext';
import { Facility } from '../../types';
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon, Users, LayoutGrid } from 'lucide-react';
import Toast from '../../components/Toast';

const FacilityManager: React.FC = () => {
  const { facilities, addFacility, updateFacility, deleteFacility } = useFacilities();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const initialFacility: Facility = {
    id: '',
    name: '',
    description: '',
    capacity: 0,
    image_url: '',
    gallery_urls: []
  };

  const [currentFacility, setCurrentFacility] = useState<Facility>(initialFacility);
  const [galleryText, setGalleryText] = useState('');

  const resetForm = () => {
    setCurrentFacility(initialFacility);
    setGalleryText('');
    setIsEditing(false);
  };

  const handleEdit = (facility: Facility) => {
    setCurrentFacility(facility);
    setGalleryText(facility.gallery_urls ? facility.gallery_urls.join('\n') : '');
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentFacility({ ...initialFacility, id: Date.now().toString() });
    setGalleryText('');
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      const success = await deleteFacility(id);
      if (success) {
        setToast({ show: true, message: 'Fasilitas berhasil dihapus!', type: 'success' });
      } else {
        setToast({ show: true, message: 'Gagal menghapus fasilitas.', type: 'error' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFacility.name) return;

    // Process gallery URLs from textarea
    const galleryUrls = galleryText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const facilityData = {
      ...currentFacility,
      gallery_urls: galleryUrls,
      image_url: currentFacility.image_url || 'https://via.placeholder.com/800x600?text=Fasilitas+RPE'
    };

    try {
      if (facilities.some(f => f.id === facilityData.id)) {
        const success = await updateFacility(facilityData);
        if (success) {
          setToast({ show: true, message: 'Fasilitas berhasil diperbarui!', type: 'success' });
          resetForm();
        } else {
          setToast({ show: true, message: 'Gagal memperbarui fasilitas.', type: 'error' });
        }
      } else {
        const success = await addFacility({ ...facilityData, id: '' });
        if (success) {
          setToast({ show: true, message: 'Fasilitas berhasil disimpan!', type: 'success' });
          resetForm();
        } else {
          setToast({ show: true, message: 'Gagal menyimpan fasilitas.', type: 'error' });
        }
      }
    } catch (err) {
      console.error('Error saving facility:', err);
      setToast({ show: true, message: 'Terjadi kesalahan saat menyimpan.', type: 'error' });
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-10">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {facilities.some(f => f.id === currentFacility.id) ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
          </h2>
          <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Fasilitas</label>
                <input
                  type="text"
                  required
                  value={currentFacility.name}
                  onChange={e => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="Lab Konversi Energi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kapasitas (Orang)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Users size={16} />
                  </span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentFacility.capacity}
                    onChange={e => setCurrentFacility({ ...currentFacility, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Fasilitas</label>
                <textarea
                  required
                  rows={5}
                  value={currentFacility.description}
                  onChange={e => setCurrentFacility({ ...currentFacility, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="Jelaskan peralatan dan fungsi fasilitas ini..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Foto Utama</label>
                <input
                  type="text"
                  value={currentFacility.image_url}
                  onChange={e => setCurrentFacility({ ...currentFacility, image_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="https://..."
                />
                <div className="mt-2 h-40 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                  {currentFacility.image_url ? (
                    <img src={currentFacility.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'} />
                  ) : (
                    <span className="text-slate-400 text-sm flex items-center"><ImageIcon className="mr-2" /> Preview</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Galeri Foto Lainnya (Satu URL per baris)</label>
                <textarea
                  rows={5}
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none font-mono text-xs"
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-sea-600 text-white font-bold hover:bg-sea-700 transition flex items-center"
            >
              <Save size={18} className="mr-2" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Fasilitas</h1>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-sea-600 text-white rounded-lg hover:bg-sea-700 transition font-medium shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Tambah Fasilitas
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Fasilitas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kapasitas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Deskripsi Singkat</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Galeri</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={facility.image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover mr-3 bg-slate-200"
                      />
                      <span className="font-semibold text-slate-800">{facility.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1.5 text-slate-400" />
                      {facility.capacity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={facility.description}>
                    {facility.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="flex items-center">
                      <LayoutGrid size={14} className="mr-1.5 text-slate-400" />
                      {facility.gallery_urls?.length || 0} Foto
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(facility)}
                      className="p-1.5 text-sea-600 hover:bg-sea-50 rounded transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(facility.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {facilities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data fasilitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacilityManager;
