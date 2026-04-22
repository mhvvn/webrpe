
import React, { useState } from 'react';
import { Book, Download, ChevronDown, ChevronUp, FileText, X } from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { Course } from '../types';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';

const Curriculum: React.FC = () => {
  const { t } = useLanguage();
  const { courses, curriculumFile } = useAcademic();
  const [openSemesters, setOpenSemesters] = useState<number[]>([6]); // Default to semester 6 for demo as per image
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const toggleSemester = (semester: number) => {
    setOpenSemesters(prev =>
      prev.includes(semester)
        ? prev.filter(s => s !== semester)
        : [...prev, semester]
    );
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleDownload = () => {
    if (curriculumFile) {
      const link = document.createElement('a');
      link.href = curriculumFile.url;
      link.download = curriculumFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(t.academic.curriculum.doc_unavailable);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">

      {/* Syllabus Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {selectedCourse.name}
              </h2>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-0 text-sm">
                {/* Table-like row layout matching reference */}
                <div className="flex border border-slate-200 dark:border-slate-700 border-b-0">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">{t.academic.curriculum.modal.course}</div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">{selectedCourse.name}</div>
                </div>
                <div className="flex border border-slate-200 dark:border-slate-700 border-b-0">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">{t.academic.curriculum.modal.code}</div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">{selectedCourse.code}</div>
                </div>
                <div className="flex border border-slate-200 dark:border-slate-700 border-b-0">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">{t.academic.curriculum.modal.credits}</div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">{selectedCourse.credits}</div>
                </div>
                <div className="flex border border-slate-200 dark:border-slate-700 border-b-0">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">{t.academic.curriculum.modal.desc}</div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">{selectedCourse.description}</div>
                </div>

                {/* Learning Outcomes */}
                <div className="flex border border-slate-200 dark:border-slate-700 border-b-0">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                    {t.academic.curriculum.modal.lo_general}
                  </div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">
                    {selectedCourse.learning_outcomes_general && selectedCourse.learning_outcomes_general.length > 0 ? (
                      <ol className="list-decimal list-inside space-y-1">
                        {selectedCourse.learning_outcomes_general.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ol>
                    ) : '-'}
                  </div>
                </div>

                {/* Specific Learning Outcomes (If exists) */}
                <div className="flex border border-slate-200 dark:border-slate-700 border-b-0">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                    {t.academic.curriculum.modal.lo_specific}
                  </div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">
                    {selectedCourse.learning_outcomes_specific || '-'}
                  </div>
                </div>

                {/* References */}
                <div className="flex border border-slate-200 dark:border-slate-700">
                  <div className="w-1/3 p-4 bg-slate-50 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                    {t.academic.curriculum.modal.refs}
                  </div>
                  <div className="w-2/3 p-4 text-slate-800 dark:text-slate-200">
                    {selectedCourse.references && selectedCourse.references.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {selectedCourse.references.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded font-medium transition"
              >
                {t.academic.curriculum.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title={t.academic.curriculum.title}
        description={t.academic.curriculum.subtitle}
      />

      {/* Download Button Section */}
      <div className="flex justify-center mb-12 mt-8">
        <button
          onClick={handleDownload}
          disabled={!curriculumFile}
          className={`inline-flex items-center px-8 py-3 font-bold rounded-lg shadow-lg transition transform hover:-translate-y-1 ${curriculumFile
            ? 'bg-sea-500 hover:bg-sea-600 text-white shadow-sea-500/30'
            : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
        >
          <Download size={20} className="mr-2" />
          {curriculumFile ? t.academic.curriculum.download_btn : t.academic.curriculum.doc_unavailable}
        </button>
      </div>

      {/* Accordion Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {semesters.map((semester) => {
          const semesterCourses = courses.filter(c => c.semester === semester);
          const isOpen = openSemesters.includes(semester);
          // Calculate Totals for Footer
          const totalCredits = semesterCourses.reduce((sum, c) => sum + c.credits, 0);
          const totalTheory = semesterCourses.reduce((sum, c) => sum + (c.credits_theory || 0), 0);
          const totalSeminar = semesterCourses.reduce((sum, c) => sum + (c.credits_seminar || 0), 0);
          const totalPracticum = semesterCourses.reduce((sum, c) => sum + (c.credits_practicum || 0), 0);

          return (
            <div key={semester} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Accordion Header */}
              <button
                onClick={() => toggleSemester(semester)}
                className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${isOpen
                  ? 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-sea-500 dark:text-white uppercase">
                    {t.academic.curriculum.semester} {semester}
                  </span>
                </div>
                <div className="text-sea-500">
                  {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="p-4 sm:p-6 animate-fade-in-down bg-white dark:bg-slate-900">
                  {semesterCourses.length > 0 ? (
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <th rowSpan={2} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-700 w-12">{t.academic.curriculum.table.no}</th>
                            <th rowSpan={2} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-700">{t.academic.curriculum.table.code}</th>
                            <th rowSpan={2} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-700 min-w-[200px]">{t.academic.curriculum.table.name}</th>
                            <th rowSpan={2} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-700 min-w-[150px]">{t.academic.curriculum.table.course_en}</th>
                            <th rowSpan={2} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-700 w-16">{t.academic.curriculum.table.credits}</th>
                            <th colSpan={3} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-700 border-b">{t.academic.curriculum.table.credit_weight}</th>
                            <th rowSpan={2} className="py-3 px-4 text-center text-sm font-bold text-slate-800 dark:text-white w-20">{t.academic.curriculum.table.syllabus}</th>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <th className="py-2 px-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-700">{t.academic.curriculum.table.theory}</th>
                            <th className="py-2 px-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-700">{t.academic.curriculum.table.seminar}</th>
                            <th className="py-2 px-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-700">{t.academic.curriculum.table.practicum}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {semesterCourses.map((course, idx) => (
                            <tr key={course.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="py-4 px-4 text-center text-sm text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                                {idx + 1}
                              </td>
                              <td className="py-4 px-4 text-center text-sm text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                                {course.code}
                              </td>
                              <td className="py-4 px-4 text-left border-r border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col items-start">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 text-white ${course.type === 'Wajib' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                    {course.type}
                                  </span>
                                  <span className="text-sm font-medium text-slate-800 dark:text-white leading-tight">
                                    {course.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-left text-sm text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                                {course.name_en || '-'}
                              </td>
                              <td className="py-4 px-4 text-center text-sm font-medium text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                                {course.credits}
                              </td>

                              {/* Credit Breakdown Columns */}
                              <td className="py-4 px-4 text-center text-sm text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                                {course.credits_theory}
                              </td>
                              <td className="py-4 px-4 text-center text-sm text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                                {course.credits_seminar}
                              </td>
                              <td className="py-4 px-4 text-center text-sm text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                                {course.credits_practicum}
                              </td>

                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => setSelectedCourse(course)}
                                  className="text-sea-500 hover:text-sea-600 dark:text-sea-400 p-1 rounded-full border border-sea-500 hover:bg-sea-50 dark:hover:bg-slate-800 transition"
                                >
                                  <FileText size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {/* Footer Row */}
                          <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold border-t border-slate-200 dark:border-slate-700">
                            <td colSpan={4} className="py-4 px-4 text-center text-sm text-slate-800 dark:text-white uppercase tracking-wider border-r border-slate-200 dark:border-slate-700">
                              {t.academic.curriculum.table.total}
                            </td>
                            <td className="py-4 px-4 text-center text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                              {totalCredits}
                            </td>
                            <td className="py-4 px-4 text-center text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                              {totalTheory}
                            </td>
                            <td className="py-4 px-4 text-center text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                              {totalSeminar}
                            </td>
                            <td className="py-4 px-4 text-center text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                              {totalPracticum}
                            </td>
                            <td className="py-4 px-4"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 italic">
                      {t.academic.curriculum.table.empty}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Curriculum;
