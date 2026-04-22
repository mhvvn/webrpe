
import React, { useState } from 'react';
import { Mail, CheckCircle, Trash2, Search, RefreshCw, X } from 'lucide-react';
import { useMessages } from '../../context/MessageContext';

const InboxManager: React.FC = () => {
    const { messages, loading, refreshMessages, markAsRead, deleteMessage } = useMessages();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

    const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await markAsRead(id);
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, is_read: true });
            }
        } catch (err: any) {
            alert('Failed to update message');
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await deleteMessage(id);
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage(null);
            }
        } catch (err: any) {
            alert('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pesan Masuk</h1>
                    <p className="text-slate-500">Kelola pesan dari formulir kontak website.</p>
                </div>
                <button
                    onClick={() => refreshMessages()}
                    className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
                {/* List */}
                <div className={`${selectedMessage ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 flex-col border-r border-slate-200`}>
                    {/* Search */}
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari pesan..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sea-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading && messages.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-slate-400">Loading...</div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Mail className="mx-auto mb-2 text-slate-300" size={48} />
                                {searchTerm ? 'Tidak ditemukan.' : 'Tidak ada pesan.'}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        onClick={() => {
                                            setSelectedMessage(msg);
                                            if (!msg.is_read) handleMarkRead(msg.id);
                                        }}
                                        className={`p-4 cursor-pointer hover:bg-slate-50 transition relative ${selectedMessage?.id === msg.id ? 'bg-sea-50' : 'bg-white'}`}
                                    >
                                        {!msg.is_read && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
                                        )}
                                        <h4 className={`font-semibold text-sm mb-1 ${msg.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{msg.name}</h4>
                                        <p className="text-xs text-slate-500 mb-2">{new Date(msg.created_at).toLocaleDateString()}</p>
                                        <p className="text-sm text-slate-600 line-clamp-2">{msg.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail View */}
                <div className={`${selectedMessage ? 'flex' : 'hidden lg:flex'} w-full lg:w-2/3 flex-col bg-slate-50/50`}>
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            {/* Detail Header */}
                            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedMessage.name}</h2>
                                    <div className="flex items-center text-slate-500 text-sm">
                                        <Mail size={14} className="mr-2" />
                                        <a href={`mailto:${selectedMessage.email}`} className="hover:text-sea-600">{selectedMessage.email}</a>
                                        <span className="mx-3">•</span>
                                        <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Hapus pesan"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8 overflow-y-auto flex-1 text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>

                            {/* Footer Actions if needed, e.g. Reply */}
                            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: Form Kontak RPE`}
                                    className="px-4 py-2 bg-sea-600 text-white rounded-lg hover:bg-sea-700 transition text-sm font-medium"
                                >
                                    Balas via Email
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Mail size={64} className="mb-4 text-slate-200" />
                            <p>Pilih pesan untuk melihat detail</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxManager;
