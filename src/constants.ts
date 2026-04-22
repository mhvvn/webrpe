
import { Course, Facility, Lecturer, NewsItem, User, Role, Statistics } from './types';

export const HERO_IMAGE = "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2070&auto=format&fit=crop";
// Logo Petir/Listrik (Energy Representation)
export const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3109/3109840.png";

// Placeholder image for Accreditation Certificate - Replace with actual uploaded URL or Base64
export const ACCREDITATION_CERT_URL = "https://www.polibatam.ac.id/wp-content/uploads/2021/10/1748828388-Sertifikat_RPE_2023-2028.pdf";
export const ACCREDITATION_CERT_IMG_URL = "/images/Akreditasi-Sertifikat_RPE_2023-2028.jpg";

export const INITIAL_STATS: Statistics = {
  students: '450+',
  courses: '48',
  awards: '25+',
  employment: '92%'
};

export const USERS_DATA: User[] = [];
export const NEWS_DATA: NewsItem[] = [];
export const COURSES_DATA: Course[] = [];
export const FACILITIES_DATA: Facility[] = [];
export const LECTURERS_DATA: Lecturer[] = [];