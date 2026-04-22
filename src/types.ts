
// Data Models matching the proposed SQL Schema

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  LECTURER = 'lecturer',
  STUDENT = 'student',
  LABORAN = 'laboran'
}

export interface User {
  id: string;
  name: string;
  username: string; // Changed from email
  password?: string; // Added password field
  role: Role;
  avatar_url?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string; // Base64 string or External URL
  type: 'image' | 'video' | 'document';
  mimeType: string;
  size?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  published_at: string;
  author_name: string;
  category: 'Event' | 'Academic' | 'Research' | 'General' | 'Student';
  // New Rich Content Fields
  gallery_urls?: string[];
  pdf_url?: string;
  pdf_name?: string;
  attachments?: Attachment[]; // New field for generic file uploads
  related_links?: { title: string; url: string }[];
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image_url: string;
  capacity: number;
  gallery_urls?: string[];
}

export interface Course {
  code: string;
  name: string;
  name_en: string; // New: English Name
  type: 'Wajib' | 'Pilihan'; // New: Course Type
  semester: number;
  credits: number; // Total SKS
  // New: Credit Breakdown
  credits_theory: number;
  credits_seminar: number;
  credits_practicum: number;
  description: string;
  syllabus_url?: string; // Optional URL for syllabus file

  // Detailed Syllabus Fields
  learning_outcomes_general?: string[]; // Capaian Pembelajaran Umum
  learning_outcomes_specific?: string; // Capaian Pembelajaran Khusus (Optional Text)
  references?: string[]; // Bahan Pustaka
}



export interface Lecturer {
  id: string;
  name: string;
  title: string; // Jabatan (e.g. Kepala Jurusan)
  specialization: string;
  image_url: string;
  email: string;
  email_secondary?: string; // New: Secondary Email
  // New Detailed Fields
  nik?: string;
  program_study?: string;
  last_education?: string;
  education_history?: string[];
  social_links?: {
    // Academic
    sinta?: string;
    scopus?: string;
    google_scholar?: string;
    linkedin?: string;
    // Social
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    // Custom/Alternative
    others?: { label: string; url: string }[];
  };
}

export interface Statistics {
  students: string;
  courses: string;
  awards: string;

  employment: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}