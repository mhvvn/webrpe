# 📋 Ringkasan Progres & Fitur RPE Smart Portal

Dokumen ini merangkum status pengembangan saat ini dan fitur-fitur yang telah diimplementasikan dalam proyek **RPE Smart Portal**.

## 🌟 Ringkasan Umum
Website ini dirancang sebagai portal akademik komprehensif untuk program studi **RPE**. Sistem ini memadukan antarmuka publik yang informatif bagi mahasiswa dan pengunjung dengan **Sistem Manajemen Konten (CMS)** yang kuat bagi administrator untuk mengelola data secara *real-time*.

---

## 🚀 Fitur Publik (Frontend User)
Bagian ini dapat diakses oleh siapa saja tanpa perlu login.

### 1. 🏠 Halaman Utama & Informasi
- **Beranda (Home)**: Landing page modern dengan informasi sorotan (highlight).
- **Tentang (About)**: Profil institusi, visi, dan misi.

### 2. 🎓 Akademik
- **Kurikulum**: Menampilkan daftar mata kuliah per semester, beban SKS, dan silabus pembelajaran.
- **Direktori Dosen**: Profil lengkap tenaga pengajar, meliputi:
  - Foto & Gelar
  - Spesialisasi/Keahlian
  - Riwayat Pendidikan
  - Kontak & Sosial Media

### 3. 🏢 Sarana & Prasarana
- **Fasilitas**: Galeri foto dan deskripsi fasilitas kampus (Lab, Kelas, dll).

### 4. 📰 Berita & Informasi
- **Berita (News)**: Daftar artikel, pengumuman, dan acara terbaru.
- **Detail Berita**: Halaman baca artikel penuh dengan dukungan lampiran file (PDF) dan galeri gambar.

### 5. 📞 Interaksi
- **Kontak**: Formulir pesan yang memungkinkan pengunjung mengirim pertanyaan langsung ke admin.

---

## 🛡️ Fitur Admin (CMS & Dashboard)
Area aman khusus untuk pengelola sistem.

### 1. 🔐 Keamanan & Akses
- **Otentikasi Aman**: Login menggunakan **JWT (JSON Web Token)**.
- **Role-Based Access**: Dukungan level akses (Admin, Super Admin).

### 2. 📊 Dashboard
- **Statistik**: Ringkasan jumlah data (Total Dosen, Berita, Pesan Masuk, dll).

### 3. 📝 Manajemen Konten (CRUD)
Admin dapat melakukan *Create, Read, Update, Delete* pada modul berikut:
- **Article Manager**: Tulis berita, upload thumbnail, lampirkan PDF/dokumen.
- **Curriculum Manager**: Atur mata kuliah, kode MK, dan struktur semester.
- **Lecturer Manager**: Tambah/Edit data dosen secara lengkap.
- **Facility Manager**: Kelola data inventaris fasilitas dan fotonya.
- **User Manager**: Kelola akun admin lain (Tambah User, Reset Password).

### 4. 📬 Kotak Masuk (Inbox)
- **Inbox Manager**: Membaca pesan yang dikirim pengunjung melalui halaman Kontak dan menandainya sebagai "sudah dibaca".

---

## 🛠️ Stack Teknologi

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Desain Responsif & Modern)
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL

### Integrasi
- **API**: RESTful API penuh (menghubungkan Frontend ke Backend database).
- **File Handling**: Dukungan upload gambar dan dokumen.

---
*Terakhir diperbarui: 11 Desember 2025*
