# Inventory Management System - Frontend (v1.0.0)

Antarmuka pengguna (UI) modern untuk sistem manajemen inventaris, dibangun dengan fokus pada performa, estetika premium, dan stabilitas menggunakan React 19.

---

## 🚀 Fitur Frontend
- **Premium Dashboard**: Visualisasi data dengan desain modern.
- **Master Data UI**: Manajemen Pegawai, Bagian, dan Otoritas dengan tabel kustom.
- **Custom Premium Table**: Native implementation untuk performa maksimal di React 19 (Zero third-party table library).
- **Glassmorphism UI**: Efek blur transparan yang elegan di seluruh komponen.
- **Full Dark Mode Support**: Transisi tema gelap dan terang yang halus.
- **Responsive Sidebar**: Navigasi yang bersih dengan dropdown dan menu development.

---

## 🛠️ Tech Stack
- **Framework**: React 19
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Hi)
- **Context**: Theme Context (Dark/Light Mode)
- **Routing**: React Router DOM v6

---

## 📝 Update Log (Frontend)

### **Mei 2, 2026**
- **Architecture Standardization (React-Hook-Form)**:
    - Migrasi seluruh modul Master Data ke `react-hook-form` untuk manajemen state yang lebih efisien dan stabil.
    - Implementasi `Controller` untuk integrasi `react-select` dan `AsyncSelect` yang lebih clean.
- **Stability & Performance Fix**:
    - Implementasi pattern `Promise.resolve().then(() => fetchData())` di dalam `useEffect` untuk menghilangkan warning React 19 terkait update state saat rendering.
    - Standarisasi pola `fetchData` menggunakan `useCallback` untuk mencegah re-render yang tidak perlu.
- **Server-Side Filtering Standardization**:
    - Mengharuskan pola `POST /cari` (FindByFilter) pada seluruh modul untuk performa pencarian yang optimal di sisi server.
    - Menambahkan helper `createCariPayload` di `src/helper/tableHelper.js` untuk simplifikasi pembuatan body request API.
- **Full Module Refactoring**:
    - Menyelesaikan modernisasi modul: **Pegawai, MasterBarang, Supplier, StokBarang, Otoritas, Bagian, Satuan, Ruangan, JenisBarang,** dan **Merk**.
- **Modal Logic Optimization**:
    - Memperbaiki lifecycle modal sehingga form otomatis ter-reset dengan bersih saat dibuka atau ditutup.

### **Mei 1, 2026**
- **Table System Overhaul**: Mengganti `react-data-table-component` dengan **Custom Premium Table** (Native Tailwind) untuk memperbaiki error rendering di React 19.
- **API Integration**: Implementasi mapping data baru untuk `list_otoritas` dan `bagian`.
- **CRUD Stabilization**: Sinkronisasi fitur Toggle Status dengan backend via endpoint `UpdateAdmin`.
- **Sidebar Polishing**:
    - Menghapus tombol "Lengkapi Berkas" yang redundan.
    - Menyesuaikan jarak menu Development.
    - Menambahkan divider pill-shaped.
- **Watermark Layout**: Menambahkan identitas author di footer layout utama.

---

## ⚙️ Panduan Instalasi (Frontend)

### Prasyarat
- Node.js (versi terbaru direkomendasikan)
- npm atau yarn

### Langkah Instalasi
1. Clone repository atau masuk ke folder `inventory-fe`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Konfigurasi Endpoint API:
   Pastikan file `src/helper/api.js` sudah mengarah ke URL backend yang benar (default: `http://localhost:8080`).

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
5. Akses aplikasi di browser melalui: `http://localhost:5173`.

---

## 👤 Author
**Risdandi Ganda Gunawan**  
*Front-end Engineer & UI Enthusiast*
