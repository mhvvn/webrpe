const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('./db.cjs');
const https = require('https');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY SETTINGS
// ============================================
app.disable('x-powered-by'); // Informasi express disembunyikan agar lebih aman

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ============================================
// SYSTEM & USER ACTIVITY LOGGING
// ============================================
app.use((req, res, next) => {
  const start = Date.now();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown User-Agent';

  // Hook triggered when response is finished to log elapsed time and status
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const now = new Date();
    // Membentuk waktu lokal ex: [YYYY-MM-DD HH:MM:SS]
    const timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '');

    // Format warna di console
    let statusColor = res.statusCode >= 500 ? '\x1b[31m' // Merah
      : res.statusCode >= 400 ? '\x1b[33m' // Kuning
      : res.statusCode >= 300 ? '\x1b[36m' // Cyan
      : '\x1b[32m'; // Hijau

    console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[35m[${ip}]\x1b[0m ${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}\x1b[0m - ${elapsed}ms \x1b[90m- ${userAgent.substring(0, 50)}...\x1b[0m`);
  });

  next();
});
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ============================================
// MULTER FILE UPLOAD CONFIGURATION (LOKAL)
// ============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limits
  fileFilter: function (req, file, cb) {
    // Keamanan: Cek tipe file untuk mencegah Backdoor / XSS
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar dan dokumen (PDF/DOC) yang diizinkan!'));
    }
  }
});



// Ensure UUID extension is available if needed
const initDb = async () => {
  try {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "settings" ("key" VARCHAR(50) PRIMARY KEY, "value" TEXT NOT NULL)`;
    console.log('✅ DB initialization checked');
  } catch (err) {
    console.error('❌ DB Init Error:', err.message);
  }
};
initDb();

// Auth Middleware - Verifies JWT Token
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Admin Only Middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// ============================================
// UPLOAD ROUTE
// ============================================
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl, name: req.file.originalname });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal Server Error during file upload' });
  }
});

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create Access Token
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, name: true, role: true, avatarUrl: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Mapping properties back for backward compatibility with frontend if necessary
    // Prisma already maps to camelCase natively with map(), but let's conform to existing shapes exactly
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      avatar_url: user.avatarUrl
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// ============================================
// USERS ROUTES (Admin Protected)
// ============================================
app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, name: true, role: true, avatarUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    const mapped = users.map(u => ({
      ...u,
      avatar_url: u.avatarUrl,
      created_at: u.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.post('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  const { username, password, name, role, avatar_url } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ message: 'Username, password, and name are required' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role: role || 'student',
        avatarUrl: avatar_url || null
      },
      select: { id: true, username: true, name: true, role: true, avatarUrl: true }
    });

    res.status(201).json({
      ...newUser,
      avatar_url: newUser.avatarUrl
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.put('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { username, password, name, role, avatar_url } = req.body;

  try {
    const updateData = {
      username,
      name,
      role,
      avatarUrl: avatar_url
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, name: true, role: true, avatarUrl: true }
    });

    res.json({
      ...updatedUser,
      avatar_url: updatedUser.avatarUrl
    });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const check = await prisma.user.findUnique({ where: { id } });
    if (check && check.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// ============================================
// NEWS ROUTES
// ============================================
const mapNews = (n) => ({
  ...n,
  image_url: n.imageUrl,
  published_at: n.publishedAt,
  author_name: n.authorName,
  gallery_urls: n.galleryUrls,
  pdf_url: n.pdfUrl,
  pdf_name: n.pdfName,
  created_at: n.createdAt
});

app.get('/api/news', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' }
    });
    res.json(news.map(mapNews));
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const newsItem = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!newsItem) return res.status(404).json({ message: 'News not found' });
    res.json(mapNews(newsItem));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.post('/api/news', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, summary, content, category, author_name, image_url, gallery_urls, pdf_url, pdf_name } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const newNews = await prisma.news.create({
      data: {
        title, summary, content, category,
        authorName: author_name,
        imageUrl: image_url,
        galleryUrls: gallery_urls || [],
        pdfUrl: pdf_url,
        pdfName: pdf_name
      }
    });
    res.status(201).json(mapNews(newNews));
  } catch (err) {
    console.error('Error creating news:', err);
    res.status(500).json({ message: 'Error creating news' });
  }
});

app.put('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category, author_name, image_url, gallery_urls, pdf_url, pdf_name } = req.body;

  try {
    const updated = await prisma.news.update({
      where: { id },
      data: {
        title, summary, content, category,
        authorName: author_name,
        imageUrl: image_url,
        galleryUrls: gallery_urls || [],
        pdfUrl: pdf_url,
        pdfName: pdf_name
      }
    });
    res.json(mapNews(updated));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'News not found' });
    console.error('Error updating news:', err);
    res.status(500).json({ message: 'Error updating news' });
  }
});

app.delete('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'News not found' });
    console.error('Error deleting news:', err);
    res.status(500).json({ message: 'Error deleting news' });
  }
});

// ============================================
// LECTURERS ROUTES
// ============================================
const mapLecturer = (l) => ({
  ...l,
  email_secondary: l.emailSecondary,
  image_url: l.imageUrl,
  program_study: l.programStudy,
  last_education: l.lastEducation,
  education_history: l.educationHistory,
  social_links: l.socialLinks,
  created_at: l.createdAt
});

app.get('/api/lecturers', async (req, res) => {
  try {
    const lecturers = await prisma.lecturer.findMany({ orderBy: { name: 'asc' } });
    res.json(lecturers.map(mapLecturer));
  } catch (err) {
    console.error('Error fetching lecturers:', err);
    res.status(500).json({ message: 'Error fetching lecturers' });
  }
});

app.get('/api/lecturers/:id', async (req, res) => {
  try {
    const lecturer = await prisma.lecturer.findUnique({ where: { id: req.params.id } });
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });
    res.json(mapLecturer(lecturer));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lecturer' });
  }
});

app.post('/api/lecturers', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, title, specialization, email, email_secondary, image_url, nik, program_study, last_education, education_history, social_links } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const newLecturer = await prisma.lecturer.create({
      data: {
        name, title, specialization, email,
        emailSecondary: email_secondary,
        imageUrl: image_url,
        nik,
        programStudy: program_study,
        lastEducation: last_education,
        educationHistory: education_history || [],
        socialLinks: social_links || null
      }
    });
    res.status(201).json(mapLecturer(newLecturer));
  } catch (err) {
    console.error('Error creating lecturer:', err);
    res.status(500).json({ message: 'Error creating lecturer' });
  }
});

app.put('/api/lecturers/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, title, specialization, email, email_secondary, image_url, nik, program_study, last_education, education_history, social_links } = req.body;

  try {
    const updated = await prisma.lecturer.update({
      where: { id },
      data: {
        name, title, specialization, email,
        emailSecondary: email_secondary,
        imageUrl: image_url,
        nik,
        programStudy: program_study,
        lastEducation: last_education,
        educationHistory: education_history || [],
        socialLinks: social_links || null
      }
    });
    res.json(mapLecturer(updated));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Lecturer not found' });
    console.error('Error updating lecturer:', err);
    res.status(500).json({ message: 'Error updating lecturer' });
  }
});

app.delete('/api/lecturers/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.lecturer.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lecturer deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Lecturer not found' });
    console.error('Error deleting lecturer:', err);
    res.status(500).json({ message: 'Error deleting lecturer' });
  }
});

// ============================================
// FACILITIES ROUTES
// ============================================
const mapFacility = (f) => ({
  ...f,
  image_url: f.imageUrl,
  gallery_urls: f.galleryUrls,
  created_at: f.createdAt
});

app.get('/api/facilities', async (req, res) => {
  try {
    const facilities = await prisma.facility.findMany({ orderBy: { name: 'asc' } });
    res.json(facilities.map(mapFacility));
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ message: 'Error fetching facilities' });
  }
});

app.get('/api/facilities/:id', async (req, res) => {
  try {
    const facility = await prisma.facility.findUnique({ where: { id: req.params.id } });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(mapFacility(facility));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching facility' });
  }
});

app.post('/api/facilities', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, image_url, capacity, gallery_urls } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const newFac = await prisma.facility.create({
      data: {
        name, description,
        imageUrl: image_url,
        capacity: capacity || 0,
        galleryUrls: gallery_urls || []
      }
    });
    res.status(201).json(mapFacility(newFac));
  } catch (err) {
    console.error('Error creating facility:', err);
    res.status(500).json({ message: 'Error creating facility' });
  }
});

app.put('/api/facilities/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, image_url, capacity, gallery_urls } = req.body;

  try {
    const updated = await prisma.facility.update({
      where: { id },
      data: {
        name, description,
        imageUrl: image_url,
        capacity: capacity || 0,
        galleryUrls: gallery_urls || []
      }
    });
    res.json(mapFacility(updated));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Facility not found' });
    console.error('Error updating facility:', err);
    res.status(500).json({ message: 'Error updating facility' });
  }
});

app.delete('/api/facilities/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.facility.delete({ where: { id: req.params.id } });
    res.json({ message: 'Facility deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Facility not found' });
    console.error('Error deleting facility:', err);
    res.status(500).json({ message: 'Error deleting facility' });
  }
});

// ============================================
// COURSES ROUTES
// ============================================
const mapCourse = (c) => ({
  ...c,
  name_en: c.nameEn,
  credits_theory: c.creditsTheory,
  credits_seminar: c.creditsSeminar,
  credits_practicum: c.creditsPracticum,
  syllabus_url: c.syllabusUrl,
  learning_outcomes_general: c.learningOutcomesGeneral,
  created_at: c.createdAt
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [
        { semester: 'asc' },
        { code: 'asc' }
      ]
    });
    res.json(courses.map(mapCourse));
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

app.get('/api/courses/:code', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({ where: { code: req.params.code } });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(mapCourse(course));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

app.post('/api/courses', authMiddleware, adminMiddleware, async (req, res) => {
  const { code, name, name_en, type, semester, credits, credits_theory, credits_seminar, credits_practicum, description, syllabus_url, learning_outcomes_general, references } = req.body;

  if (!code || !name) return res.status(400).json({ message: 'Code and name are required' });

  try {
    const newCourse = await prisma.course.create({
      data: {
        code, name, type, semester, credits, description,
        nameEn: name_en,
        creditsTheory: credits_theory,
        creditsSeminar: credits_seminar,
        creditsPracticum: credits_practicum,
        syllabusUrl: syllabus_url,
        learningOutcomesGeneral: learning_outcomes_general || [],
        references: references || []
      }
    });
    res.status(201).json(mapCourse(newCourse));
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'Course code already exists' });
    console.error('Error creating course:', err);
    res.status(500).json({ message: 'Error creating course' });
  }
});

app.put('/api/courses/:code', authMiddleware, adminMiddleware, async (req, res) => {
  const { code } = req.params;
  const { name, name_en, type, semester, credits, credits_theory, credits_seminar, credits_practicum, description, syllabus_url, learning_outcomes_general, references } = req.body;

  try {
    const updated = await prisma.course.update({
      where: { code },
      data: {
        name, type, semester, credits, description,
        nameEn: name_en,
        creditsTheory: credits_theory,
        creditsSeminar: credits_seminar,
        creditsPracticum: credits_practicum,
        syllabusUrl: syllabus_url,
        learningOutcomesGeneral: learning_outcomes_general || [],
        references: references || []
      }
    });
    res.json(mapCourse(updated));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Course not found' });
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Error updating course' });
  }
});

app.delete('/api/courses/:code', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.course.delete({ where: { code: req.params.code } });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Course not found' });
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// ============================================
// MESSAGES ROUTES
// ============================================
const mapMsg = (m) => ({ ...m, is_read: m.isRead, created_at: m.createdAt });

app.get('/api/messages', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages.map(mapMsg));
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required' });

  try {
    const newMsg = await prisma.message.create({
      data: { name, email, message }
    });
    res.status(201).json(mapMsg(newMsg));
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.put('/api/messages/:id/read', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });
    res.json(mapMsg(updated));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Message not found' });
    console.error('Error updating message:', err);
    res.status(500).json({ message: 'Error updating message' });
  }
});

app.delete('/api/messages/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Message not found' });
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

// ============================================
// SETTINGS / STATS ROUTES
// ============================================
app.get('/api/settings/stats', async (req, res) => {
  try {
    const defaultStats = { students: "450+", courses: "48", awards: "25+", employment: "92%" };

    // We try/catch the specific table call to handle cases where 
    // migration hasn't been applied yet, falling back to default.
    try {
      const record = await prisma.setting.findUnique({ where: { key: 'stats' } });
      if (record && record.value) {
        return res.json(JSON.parse(record.value));
      }
    } catch (e) {
      console.warn("Setting table might not exist yet", e.message);
    }

    res.json(defaultStats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

app.put('/api/settings/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = req.body;
    const updated = await prisma.setting.upsert({
      where: { key: 'stats' },
      update: { value: JSON.stringify(stats) },
      create: { key: 'stats', value: JSON.stringify(stats) }
    });
    res.json(JSON.parse(updated.value));
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).json({ message: 'Error updating stats' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
  }
});

// ============================================
// CATCH-ALL FOR REACT SPA
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Express Global Error Handler (to ensure Vercel returns JSON not HTML on crash)
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(500).json({ message: "Internal Server Error: " + err.message });
});

if (process.env.VERCEL) {
  // Jalankan sebagai Serverless Function di Vercel
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}
