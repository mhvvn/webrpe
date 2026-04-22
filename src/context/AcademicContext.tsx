import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { COURSES_DATA, LECTURERS_DATA } from '../constants';
import { Course, Lecturer } from '../types';
import api from '../services/api';

interface CurriculumFile {
  name: string;
  url: string;
  date: string;
}

interface AcademicContextType {
  courses: Course[];
  lecturers: Lecturer[];
  curriculumFile: CurriculumFile | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  addCourse: (course: Course) => Promise<boolean>;
  updateCourse: (course: Course) => Promise<boolean>;
  deleteCourse: (code: string) => Promise<boolean>;
  addLecturer: (lecturer: Lecturer) => Promise<boolean>;
  updateLecturer: (lecturer: Lecturer) => Promise<boolean>;
  deleteLecturer: (id: string) => Promise<boolean>;
  updateCurriculumFile: (file: CurriculumFile) => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [curriculumFile, setCurriculumFile] = useState<CurriculumFile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [coursesData, lecturersData] = await Promise.all([
        api.getCourses(),
        api.getLecturers(),
      ]);
      setCourses(coursesData);
      setLecturers(lecturersData);
    } catch (err) {
      console.warn('Failed to fetch academic data from API, using mock data');
      setCourses(COURSES_DATA);
      setLecturers(LECTURERS_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Course CRUD
  const addCourse = async (course: Course): Promise<boolean> => {
    try {
      const newCourse = await api.createCourse(course);
      setCourses(prev => [...prev, newCourse]);
      return true;
    } catch (err) {
      console.error('Failed to add course:', err);
      return false;
    }
  };

  const updateCourse = async (course: Course): Promise<boolean> => {
    try {
      const updated = await api.updateCourse(course.code, course);
      setCourses(prev => prev.map(c => (c.code === updated.code ? updated : c)));
      return true;
    } catch (err) {
      console.error('Failed to update course:', err);
      return false;
    }
  };

  const deleteCourse = async (code: string): Promise<boolean> => {
    try {
      await api.deleteCourse(code);
      setCourses(prev => prev.filter(c => c.code !== code));
      return true;
    } catch (err) {
      console.error('Failed to delete course:', err);
      return false;
    }
  };

  // Lecturer CRUD
  const addLecturer = async (lecturer: Lecturer): Promise<boolean> => {
    try {
      const newLecturer = await api.createLecturer(lecturer);
      setLecturers(prev => [...prev, newLecturer]);
      return true;
    } catch (err) {
      console.error('Failed to add lecturer:', err);
      return false;
    }
  };

  const updateLecturer = async (lecturer: Lecturer): Promise<boolean> => {
    try {
      const updated = await api.updateLecturer(lecturer.id, lecturer);
      setLecturers(prev => prev.map(l => (l.id === updated.id ? updated : l)));
      return true;
    } catch (err) {
      console.error('Failed to update lecturer:', err);
      return false;
    }
  };

  const deleteLecturer = async (id: string): Promise<boolean> => {
    try {
      await api.deleteLecturer(id);
      setLecturers(prev => prev.filter(l => l.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete lecturer:', err);
      return false;
    }
  };

  const updateCurriculumFile = (file: CurriculumFile) => {
    setCurriculumFile(file);
  };

  return (
    <AcademicContext.Provider
      value={{
        courses,
        lecturers,
        curriculumFile,
        loading,
        refreshData,
        addCourse,
        updateCourse,
        deleteCourse,
        addLecturer,
        updateLecturer,
        deleteLecturer,
        updateCurriculumFile,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (context === undefined) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
