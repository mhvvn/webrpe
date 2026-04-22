import React from 'react';
import { Book, GraduationCap } from 'lucide-react';
import { COURSES_DATA, LECTURERS_DATA } from '../constants';

const Academic: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      <div className="bg-sea-900 dark:bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Akademik</h1>
          <p className="text-sea-200 dark:text-slate-400">Kurikulum berbasis industri dan profil pengajar ahli.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Curriculum Table */}
        <div className="mb-16">
            <div className="flex items-center mb-8">
                <Book className="text-sea-600 dark:text-sea-400 mr-3" size={28} />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kurikulum Unggulan</h2>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-sea-50 dark:bg-slate-800 border-b border-sea-100 dark:border-slate-700">
                                <th className="p-4 text-sm font-semibold text-sea-800 dark:text-sea-200">Kode</th>
                                <th className="p-4 text-sm font-semibold text-sea-800 dark:text-sea-200">Mata Kuliah</th>
                                <th className="p-4 text-sm font-semibold text-sea-800 dark:text-sea-200 text-center">Semester</th>
                                <th className="p-4 text-sm font-semibold text-sea-800 dark:text-sea-200 text-center">SKS</th>
                                <th className="p-4 text-sm font-semibold text-sea-800 dark:text-sea-200">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {COURSES_DATA.map((course) => (
                                <tr key={course.code} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <td className="p-4 text-sm font-mono text-slate-500 dark:text-slate-400">{course.code}</td>
                                    <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">{course.name}</td>
                                    <td className="p-4 text-sm text-center text-slate-600 dark:text-slate-400">{course.semester}</td>
                                    <td className="p-4 text-sm text-center text-slate-600 dark:text-slate-400">{course.credits}</td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 max-w-md">{course.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center">
                    <button className="text-sea-600 dark:text-sea-400 text-sm font-semibold hover:text-sea-700 dark:hover:text-sea-300">Lihat Kurikulum Lengkap</button>
                </div>
            </div>
        </div>

        {/* Lecturers Grid */}
        <div>
            <div className="flex items-center mb-8">
                <GraduationCap className="text-amber-500 mr-3" size={28} />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dosen & Staff Pengajar</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {LECTURERS_DATA.map((lecturer) => (
                    <div key={lecturer.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-start space-x-4 hover:shadow-md transition">
                        <img 
                            src={lecturer.image_url} 
                            alt={lecturer.name} 
                            className="w-20 h-20 rounded-lg object-cover bg-slate-200 dark:bg-slate-800 shrink-0"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-1">{lecturer.name}</h3>
                            <p className="text-xs text-sea-600 dark:text-sea-400 font-semibold uppercase mb-2">{lecturer.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ahli: {lecturer.specialization}</p>
                            <a href={`mailto:${lecturer.email}`} className="text-xs text-amber-500 hover:text-amber-600 truncate block">
                                {lecturer.email}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Academic;