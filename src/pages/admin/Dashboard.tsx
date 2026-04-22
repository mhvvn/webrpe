import React from 'react';
import { useNews } from '../../context/NewsContext';
import { useAcademic } from '../../context/AcademicContext';
import { useFacilities } from '../../context/FacilityContext';
import { useMessages } from '../../context/MessageContext';
import { FileText, Users, Building, Mail } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { news } = useNews();
  const { lecturers } = useAcademic();
  const { facilities } = useFacilities();
  const { messages } = useMessages();

  const stats = [
    { label: 'Total Artikel', value: news.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Dosen dan Staff', value: lecturers.length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Fasilitas', value: facilities.length, icon: Building, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Pesan', value: messages.length, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Mockup */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Artikel Terbaru</h2>
          <div className="space-y-4">
            {news.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-16 h-12 object-cover rounded-md mr-4 bg-slate-200"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.title}</h4>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs px-2 py-0.5 bg-sea-50 text-sea-700 rounded-full">{item.category}</span>
                    <span className="text-xs text-slate-400">{item.published_at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-sea-800 to-sea-900 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-2">Selamat Datang, Admin!</h2>
          <p className="text-sea-100 text-sm mb-6 leading-relaxed">
            Ini adalah panel kontrol untuk mengelola konten website Jurusan RPE. Anda dapat menambahkan berita prestasi mahasiswa, jadwal kuliah tamu, atau informasi akademik terbaru.
          </p>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <p className="text-xs text-amber-300 font-semibold mb-1">Tips:</p>
            <p className="text-xs text-sea-50">Gunakan gambar dengan rasio 16:9 untuk tampilan terbaik pada halaman depan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;