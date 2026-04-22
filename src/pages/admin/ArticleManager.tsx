
import React, { useState, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { NewsItem, Attachment } from '../../types';
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon, FileText, Link as LinkIcon, UploadCloud, Film, FileSpreadsheet, FileType } from 'lucide-react';
import Toast from '../../components/Toast';
import api from '../../services/api';

const ArticleManager: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useNews();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<NewsItem>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Temporary state for gallery textarea
  const [galleryText, setGalleryText] = useState('');

  // State for file upload loading
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form to initial state
  const resetForm = () => {
    setCurrentPost({});
    setGalleryText('');
    setIsEditing(false);
    setIsUploading(false);
  };

  const handleEdit = (item: NewsItem) => {
    setCurrentPost(item);
    setGalleryText(item.gallery_urls ? item.gallery_urls.join('\n') : '');
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      const success = await deleteNews(id);
      if (success) {
        setToast({ show: true, message: 'Artikel berhasil dihapus!', type: 'success' });
      } else {
        setToast({ show: true, message: 'Gagal menghapus artikel.', type: 'error' });
      }
    }
  };

  const handleCreate = () => {
    setCurrentPost({
      published_at: new Date().toISOString().split('T')[0],
      author_name: 'Admin',
      category: 'General',
      attachments: []
    });
    setGalleryText('');
    setIsEditing(true);
  };

  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMain(true);
    try {
      const uploaded = await api.uploadFile(file);
      setCurrentPost(prev => ({ ...prev, image_url: uploaded.url }));
      setToast({ show: true, message: 'Gambar utama berhasil diunggah', type: 'success' });
    } catch (err) {
      setToast({ show: true, message: 'Gagal mengunggah gambar utama', type: 'error' });
    } finally {
      setIsUploadingMain(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      let newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const uploaded = await api.uploadFile(files[i]);
        newUrls.push(uploaded.url);
      }
      setGalleryText(prev => prev ? prev + '\n' + newUrls.join('\n') : newUrls.join('\n'));
      setToast({ show: true, message: 'Foto galeri berhasil diunggah', type: 'success' });
    } catch (err) {
      setToast({ show: true, message: 'Gagal mengunggah foto galeri', type: 'error' });
    } finally {
      setIsUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newAttachments: Attachment[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Simple validation (limit size to 10MB for browser memory safety)
        if (file.size > 10 * 1024 * 1024) {
          setToast({ show: true, message: `File ${file.name} terlalu besar (Max 10MB)`, type: 'error' });
          continue;
        }

        const uploadedFile = await api.uploadFile(file);
        const uploadedUrl = uploadedFile.url;

        let type: 'image' | 'video' | 'document' = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';

        const attachment: Attachment = {
          id: Date.now().toString() + i,
          name: file.name,
          url: uploadedUrl,
          type: type,
          mimeType: file.type,
          size: file.size
        };

        newAttachments.push(attachment);

        // Auto-set main image if not set
        if (type === 'image' && !currentPost.image_url) {
          setCurrentPost(prev => ({ ...prev, image_url: uploadedUrl }));
        }
      }

      setCurrentPost(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newAttachments]
      }));

    } catch (error) {
      console.error("Error uploading file", error);
      setToast({ show: true, message: "Gagal memproses file.", type: 'error' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setCurrentPost(prev => ({
      ...prev,
      attachments: prev.attachments?.filter(a => a.id !== attachmentId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.content) return;

    // Process Gallery URLs from textarea (one per line)
    const galleryUrls = galleryText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const postData = {
      ...currentPost,
      gallery_urls: galleryUrls
    };

    try {
      if (currentPost.id) {
        // Update existing
        const success = await updateNews(postData as NewsItem);
        if (success) {
          setToast({ show: true, message: 'Artikel berhasil diperbarui!', type: 'success' });
          resetForm();
        } else {
          setToast({ show: true, message: 'Gagal memperbarui artikel.', type: 'error' });
        }
      } else {
        // Create new
        const newItem: NewsItem = {
          ...postData as NewsItem,
          id: '', // Will be generated by backend
          image_url: currentPost.image_url || 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&q=80&w=800'
        };
        const success = await addNews(newItem);
        if (success) {
          setToast({ show: true, message: 'Artikel berhasil disimpan!', type: 'success' });
          resetForm();
        } else {
          setToast({ show: true, message: 'Gagal menyimpan artikel.', type: 'error' });
        }
      }
    } catch (err) {
      console.error('Error saving article:', err);
      setToast({ show: true, message: 'Terjadi kesalahan saat menyimpan artikel.', type: 'error' });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="text-red-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return <FileSpreadsheet className="text-green-500" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileType className="text-blue-500" />;
    if (mimeType.startsWith('video/')) return <Film className="text-purple-500" />;
    if (mimeType.startsWith('image/')) return <ImageIcon className="text-amber-500" />;
    return <FileText className="text-slate-500" />;
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
            {currentPost.id ? 'Edit Artikel' : 'Tambah Artikel Baru'}
          </h2>
          <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={currentPost.title || ''}
                  onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select
                  value={currentPost.category || 'General'}
                  onChange={e => setCurrentPost({ ...currentPost, category: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none bg-white"
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Student">Student</option>
                  <option value="Event">Event</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Penulis</label>
                <input
                  type="text"
                  value={currentPost.author_name || ''}
                  onChange={e => setCurrentPost({ ...currentPost, author_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Publikasi</label>
                <input
                  type="date"
                  value={currentPost.published_at || ''}
                  onChange={e => setCurrentPost({ ...currentPost, published_at: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Utama</label>
                <div className="flex flex-col space-y-2">
                  {/* URL Input */}
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500">
                      <ImageIcon size={18} />
                    </span>
                    <input
                      type="text"
                      value={currentPost.image_url || ''}
                      onChange={e => setCurrentPost({ ...currentPost, image_url: e.target.value })}
                      placeholder="https://... atau klik tombol =>"
                      className="flex-1 px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                    />
                    <input type="file" ref={mainImageInputRef} accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                    <button
                      type="button"
                      onClick={() => mainImageInputRef.current?.click()}
                      disabled={isUploadingMain}
                      className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-sea-50 hover:bg-sea-100 text-sea-700 font-medium transition"
                    >
                      {isUploadingMain ? <UploadCloud size={18} className="animate-bounce" /> : <UploadCloud size={18} />}
                      <span className="ml-2 hidden sm:inline">Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div className="h-48 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative">
                {currentPost.image_url ? (
                  <img src={currentPost.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image')} />
                ) : (
                  <span className="text-slate-400 text-sm">Preview Gambar Utama</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ringkasan (Summary)</label>
            <input
              type="text"
              required
              value={currentPost.summary || ''}
              onChange={e => setCurrentPost({ ...currentPost, summary: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Ditampilkan pada kartu preview di halaman depan.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Konten Lengkap</label>
            <textarea
              required
              rows={8}
              value={currentPost.content || ''}
              onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none font-mono text-sm"
              placeholder="Tulis konten artikel di sini. Gunakan enter untuk paragraf baru."
            />
          </div>

          {/* New File Upload Section */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center">
              <UploadCloud size={18} className="mr-2" /> Upload File (Lokal)
            </h3>

            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-100 transition mb-6">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.csv,.mp4"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud size={40} className="text-sea-500 mb-2" />
                <span className="text-sm font-medium text-slate-700">Klik untuk upload file</span>
                <span className="text-xs text-slate-500 mt-1">
                  Support: JPG, PNG, PDF, Word, Excel, MP4 (Max 10MB)
                </span>
                {isUploading && <span className="text-sea-600 font-bold mt-2 animate-pulse">Memproses file...</span>}
              </label>
            </div>

            {/* Attachments List */}
            {currentPost.attachments && currentPost.attachments.length > 0 && (
              <div className="space-y-2 mb-6">
                <p className="text-sm font-bold text-slate-700">File Terlampir:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPost.attachments.map((file) => (
                    <div key={file.id} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="p-2 bg-slate-100 rounded mr-3">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {file.type.toUpperCase()} • {(file.size ? (file.size / 1024).toFixed(0) + ' KB' : 'Unknown')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legacy Gallery Link Section (Optional) */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center">
              <LinkIcon size={18} className="mr-2" /> Tautan Galeri (Opsional)
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">URL Galeri Foto Eksternal (Satu URL per baris)</label>
                  <div>
                    <input type="file" ref={galleryInputRef} accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isUploadingGallery}
                      className="text-xs font-medium text-sea-600 hover:text-sea-700 bg-sea-50 px-2 py-1 rounded inline-flex items-center"
                    >
                      <UploadCloud size={14} className="mr-1" />
                      {isUploadingGallery ? 'Mengunggah...' : 'Upload Foto Galeri'}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none text-xs font-mono"
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                ></textarea>
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
              Simpan Artikel
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
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Berita</h1>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-sea-600 text-white rounded-lg hover:bg-sea-700 transition font-medium shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Tambah Artikel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Artikel</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kategori</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Lampiran</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 max-w-xs sm:max-w-md">
                    <div className="flex items-center">
                      <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover mr-3 bg-slate-200" />
                      <div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{item.summary}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.category === 'Academic' ? 'bg-blue-100 text-blue-700' :
                      item.category === 'Event' ? 'bg-amber-100 text-amber-700' :
                        item.category === 'Student' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.published_at}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.attachments && item.attachments.length > 0 ? (
                      <span className="flex items-center text-xs bg-slate-100 px-2 py-1 rounded w-fit">
                        <UploadCloud size={12} className="mr-1" /> {item.attachments.length} File
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-sea-600 hover:bg-sea-50 rounded transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada artikel. Klik tombol "Tambah Artikel" untuk membuat baru.
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

export default ArticleManager;
