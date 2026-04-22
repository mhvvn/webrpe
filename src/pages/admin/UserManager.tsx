
import React, { useState } from 'react';
import { useUsers } from '../../context/UserContext';
import { User, Role } from '../../types';
import { Plus, Pencil, Trash2, X, Save, User as UserIcon, Lock, Shield, Image as ImageIcon, AlertTriangle, Key } from 'lucide-react';
import Toast from '../../components/Toast';

const UserManager: React.FC = () => {
  const { users, currentUser, addUser, updateUser, deleteUser } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const initialUser: User = {
    id: '',
    name: '',
    username: '',
    password: '',
    role: Role.STUDENT,
    avatar_url: ''
  };

  const [currentEditUser, setCurrentEditUser] = useState<User>(initialUser);

  const resetForm = () => {
    setCurrentEditUser(initialUser);
    setIsEditing(false);
  };

  const handleEdit = (user: User) => {
    setCurrentEditUser(user);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentEditUser(initialUser); // ID is empty string
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;

    // PROTECTION LOGIC
    if ((targetUser.role as Role) === Role.SUPER_ADMIN) {
      setToast({ show: true, message: "SUPER ADMIN tidak dapat dihapus!", type: 'error' });
      return;
    }

    if (currentUser?.role !== Role.SUPER_ADMIN && targetUser.role === Role.SUPER_ADMIN) {
      setToast({ show: true, message: "Anda tidak memiliki akses untuk menghapus Super Admin.", type: 'error' });
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${targetUser.name}?`)) {
      const success = await deleteUser(id);
      if (success) {
        setToast({ show: true, message: `User ${targetUser.name} berhasil dihapus!`, type: 'success' });
      } else {
        setToast({ show: true, message: 'Gagal menghapus user.', type: 'error' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditUser.name || !currentEditUser.username) return;

    // Use existing password if editing and field is left blank, otherwise require it for new users
    // Use existing password if editing and field is left blank, otherwise require it for new users
    if (!currentEditUser.id && !currentEditUser.password) {
      setToast({ show: true, message: "Password wajib diisi untuk user baru", type: 'error' });
      return;
    }

    // Use default avatar if empty
    const userData: User = {
      ...currentEditUser,
      avatar_url: currentEditUser.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=100'
    };

    if (userData.id && users.some(u => u.id === userData.id)) {
      // Update existing user
      const success = await updateUser(userData);
      if (success) {
        setToast({ show: true, message: `User ${userData.name} berhasil diperbarui!`, type: 'success' });
        resetForm();
      } else {
        setToast({ show: true, message: "Gagal memperbarui data user.", type: 'error' });
      }
    } else {
      // Create New User
      const success = await addUser(userData);
      if (success) {
        setToast({ show: true, message: `User ${userData.name} berhasil disimpan!`, type: 'success' });
        resetForm();
      } else {
        setToast({ show: true, message: "Gagal menyimpan data ke database.", type: 'error' });
      }
    }
  };

  // Only allow Super Admin and Admin to see this page
  // (Redundant if Sidebar hides it, but good for security)
  if (currentUser?.role !== Role.SUPER_ADMIN && currentUser?.role !== Role.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-10">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {users.some(u => u.id === currentEditUser.id) ? 'Edit User' : 'Tambah User Baru'}
          </h2>
          <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={currentEditUser.name}
                  onChange={e => setCurrentEditUser({ ...currentEditUser, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="Nama User"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={currentEditUser.username}
                  onChange={e => setCurrentEditUser({ ...currentEditUser, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder="username123"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="text" // Show password for simple admin management
                  value={currentEditUser.password || ''}
                  onChange={e => setCurrentEditUser({ ...currentEditUser, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                  placeholder={currentEditUser.id ? "Biarkan kosong jika tidak diubah" : "Password wajib diisi"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role (Peran)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Shield size={16} />
                </span>
                <select
                  value={currentEditUser.role}
                  onChange={e => setCurrentEditUser({ ...currentEditUser, role: e.target.value as Role })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none bg-white"
                >
                  {currentUser?.role === Role.SUPER_ADMIN && (
                    <option value={Role.SUPER_ADMIN}>Super Admin</option>
                  )}
                  <option value={Role.ADMIN}>Admin</option>
                  <option value={Role.LECTURER}>Lecturer (Dosen)</option>
                  <option value={Role.LABORAN}>Laboran (Teknisi)</option>
                  <option value={Role.STUDENT}>Student (Mahasiswa)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL Avatar</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <ImageIcon size={16} />
              </span>
              <input
                type="text"
                value={currentEditUser.avatar_url || ''}
                onChange={e => setCurrentEditUser({ ...currentEditUser, avatar_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sea-500 outline-none"
                placeholder="https://..."
              />
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
        <h1 className="text-2xl font-bold text-slate-800">Manajemen User</h1>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-sea-600 text-white rounded-lg hover:bg-sea-700 transition font-medium shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Tambah User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Username</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={user.avatar_url || 'https://via.placeholder.com/40'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover mr-3 bg-slate-200"
                      />
                      <span className="font-semibold text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${user.role === Role.SUPER_ADMIN ? 'bg-slate-800 text-white' :
                      user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
                        user.role === Role.LECTURER ? 'bg-blue-100 text-blue-800' :
                          user.role === Role.LABORAN ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                      }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1.5 text-sea-600 hover:bg-sea-50 rounded transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    {user.role !== Role.SUPER_ADMIN && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;