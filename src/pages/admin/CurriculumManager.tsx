
import React, { useState, useRef, useEffect } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Course } from '../../types';
import { Plus, Pencil, Trash2, X, Save, Book, UploadCloud, FileText, CheckCircle, Info } from 'lucide-react';
import Toast from '../../components/Toast';

const CurriculumManager: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, curriculumFile, updateCurriculumFile } = useAcademic();
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial empty state
  const initialCourse: Course = {
    code: '',
    name: '',
    name_en: '',
    type: 'Wajib',
    semester: 1,
    credits: 0,
    credits_theory: 0,
    credits_seminar: 0,
    credits_practicum: 0,
    description: '',
    learning_outcomes_general: [],
    references: []
  };
  const [currentCourse, setCurrentCourse] = useState<Course>(initialCourse);

  // Helper state for array inputs (textarea)
  const [learningOutcomesText, setLearningOutcomesText] = useState('');
  const [referencesText, setReferencesText] = useState('');

  // Auto calculate total SKS
  useEffect(() => {
    const total = (currentCourse.credits_theory || 0) + (currentCourse.credits_seminar || 0) + (currentCourse.credits_practicum || 0);
    if (total !== currentCourse.credits) {
      setCurrentCourse(prev => ({ ...prev, credits: total }));
    }
  }, [currentCourse.credits_theory, currentCourse.credits_seminar, currentCourse.credits_practicum]);

  const resetForm = () => {
    setCurrentCourse(initialCourse);
    setLearningOutcomesText('');
    setReferencesText('');
    setIsEditing(false);
    setIsNew(false);
  };

  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setLearningOutcomesText(course.learning_outcomes_general ? course.learning_outcomes_general.join('\n') : '');
    setReferencesText(course.references ? course.references.join('\n') : '');
    setIsEditing(true);
    setIsNew(false);
  };

  const handleCreate = () => {
    setCurrentCourse(initialCourse);
    setLearningOutcomesText('');
    setReferencesText('');
    setIsEditing(true);
    setIsNew(true);
  };

  const handleDelete = (code: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus mata kuliah ${code}?`)) {
      deleteCourse(code);
      setToast({ show: true, message: 'Mata kuliah berhasil dihapus!', type: 'success' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew) {
      if (courses.some(c => c.code === currentCourse.code)) {
        setToast({ show: true, message: 'Kode mata kuliah sudah ada!', type: 'error' });
        return;
      }
    }

    const courseData: Course = {
      ...currentCourse,
      learning_outcomes_general: learningOutcomesText.split('\n').filter(line => line.trim() !== ''),
      references: referencesText.split('\n').filter(line => line.trim() !== '')
    };

    if (isNew) {
      addCourse(courseData);
      setToast({ show: true, message: 'Mata kuliah berhasil ditambahkan!', type: 'success' });
    } else {
      updateCourse(courseData);
      setToast({ show: true, message: 'Mata kuliah berhasil diperbarui!', type: 'success' });
    }
    resetForm();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setToast({ show: true, message: "Ukuran file terlalu besar (Max 10MB)", type: 'error' });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateCurriculumFile({
        name: file.name,
        url: base64,
        date: new Date().toLocaleDateString('id-ID')
      });
      setToast({ show: true, message: 'File kurikulum berhasil diupdate!', type: 'success' });
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setToast({ show: true, message: "Gagal membaca file", type: 'error' });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
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
            {isNew ? 'Tambah Mata Kuliah' : 'Edit Mata Kuliah'}
          </h2>
          <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kode MK</label>
              <input
                type="text"
                required
                disabled={!isNew} // Cannot change ID when editing
                value={currentCourse.code}
                onChange={e => setCurrentCourse({ ...currentCourse, code: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none ${!isNew ? 'bg-slate-100 text-slate-500' : ''}`}
                placeholder="RPE101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={currentCourse.semester}
                onChange={e => setCurrentCourse({ ...currentCourse, semester: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mata Kuliah (ID)</label>
              <input
                type="text"
                required
                value={currentCourse.name}
                onChange={e => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                placeholder="Fisika Terapan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">English Name (Course)</label>
              <input
                type="text"
                value={currentCourse.name_en || ''}
                onChange={e => setCurrentCourse({ ...currentCourse, name_en: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                placeholder="Applied Physics"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Mata Kuliah</label>
              <select
                value={currentCourse.type}
                onChange={e => setCurrentCourse({ ...currentCourse, type: e.target.value as 'Wajib' | 'Pilihan' })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none bg-white"
              >
                <option value="Wajib">Wajib (Required)</option>
                <option value="Pilihan">Pilihan (Elective)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total SKS (Auto Calc)</label>
              <input
                type="number"
                readOnly
                value={currentCourse.credits}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Credit Breakdown */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
              <Info size={16} className="mr-2 text-sea-500" /> Distribusi Bobot SKS
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Teori</label>
                <input
                  type="number"
                  min="0"
                  value={currentCourse.credits_theory}
                  onChange={e => setCurrentCourse({ ...currentCourse, credits_theory: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:ring-1 focus:ring-sea-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Seminar</label>
                <input
                  type="number"
                  min="0"
                  value={currentCourse.credits_seminar}
                  onChange={e => setCurrentCourse({ ...currentCourse, credits_seminar: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:ring-1 focus:ring-sea-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Praktikum</label>
                <input
                  type="number"
                  min="0"
                  value={currentCourse.credits_practicum}
                  onChange={e => setCurrentCourse({ ...currentCourse, credits_practicum: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:ring-1 focus:ring-sea-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat (Silabus)</label>
            <textarea
              required
              rows={3}
              value={currentCourse.description}
              onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
              placeholder="Deskripsi materi yang dipelajari..."
            />
          </div>

          {/* New Detailed Syllabus Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capaian Pembelajaran (Learning Outcomes)</label>
              <textarea
                rows={5}
                value={learningOutcomesText}
                onChange={e => setLearningOutcomesText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none font-mono text-sm"
                placeholder="1. Mampu memahami...&#10;2. Mampu menganalisis..."
              />
              <p className="text-xs text-slate-500 mt-1">Gunakan enter untuk baris baru (poin).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bahan Pustaka (References)</label>
              <textarea
                rows={5}
                value={referencesText}
                onChange={e => setReferencesText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none font-mono text-sm"
                placeholder="Judul Buku 1 - Penulis&#10;Judul Buku 2 - Penulis"
              />
              <p className="text-xs text-slate-500 mt-1">Gunakan enter untuk baris baru.</p>
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
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Kurikulum</h1>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-sea-600 text-white rounded-lg hover:bg-sea-700 transition font-medium shadow-sm text-sm"
        >
          <Plus size={18} className="mr-2" />
          Tambah Mata Kuliah
        </button>
      </div>

      {/* Curriculum File Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Book size={20} className="mr-2 text-sea-600" /> Dokumen Kurikulum Utama (PDF)
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-100 transition relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <UploadCloud size={32} className="text-sea-500 mb-2" />
                <span className="text-sm font-medium text-slate-700">
                  {isUploading ? 'Mengupload...' : 'Klik untuk ganti file Kurikulum'}
                </span>
                <span className="text-xs text-slate-500 mt-1">Format PDF, Max 10MB</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-sea-50 rounded-lg p-4 border border-sea-100">
            <div className="flex items-start">
              <div className="p-2 bg-white rounded-md border border-sea-200 mr-3">
                <FileText size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Status File Saat Ini</h3>
                {curriculumFile ? (
                  <div className="mt-1">
                    <p className="text-sm text-sea-700 font-medium truncate max-w-[200px]" title={curriculumFile.name}>
                      {curriculumFile.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center mt-1">
                      <CheckCircle size={10} className="mr-1 text-green-500" />
                      Diupdate: {curriculumFile.date}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic mt-1">Belum ada file yang diupload.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Daftar Mata Kuliah</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kode</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Mata Kuliah</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Sem</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">SKS</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">T/S/P</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...courses].sort((a, b) => a.semester - b.semester).map((course) => (
                <tr key={course.code} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-sea-700 font-bold">{course.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{course.name}</div>
                    <div className="text-xs text-slate-500 italic">{course.name_en}</div>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${course.type === 'Wajib' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">{course.semester}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{course.credits}</td>
                  <td className="px-6 py-4 text-center text-xs text-slate-500">
                    {course.credits_theory}/{course.credits_seminar}/{course.credits_practicum}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-1.5 text-sea-600 hover:bg-sea-50 rounded transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.code)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data mata kuliah.
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

export default CurriculumManager;
