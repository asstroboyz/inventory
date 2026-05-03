# Inventory Management System - Frontend

Sistem Manajemen Inventaris (FE) adalah aplikasi web modern yang dirancang untuk mengelola stok barang, aset perusahaan, dan manajemen pegawai dengan antarmuka yang elegan dan performa tinggi. Aplikasi ini dibangun menggunakan **React 19** dan **Tailwind CSS** dengan fokus pada estetika premium dan pengalaman pengguna yang mulus.

---

## 🚀 Fitur Utama

- **Role-Based Dashboard**: Tampilan cerdas yang menyesuaikan informasi (Stats & Quick Actions) berdasarkan peran pengguna (Admin, Kepala BPS, Pengadaan, atau Staf).
- **Master Data Management**: Kelola data Pegawai, Produk, Bagian, dan Lokasi dengan antarmuka modal yang intuitif.
- **Custom Premium Table**: Sistem tabel native tanpa library pihak ketiga, dioptimalkan sepenuhnya untuk React 19 agar tetap stabil dan cepat.
- **Monitoring Stok & Aset**: Pantau pergerakan barang masuk/keluar secara real-time dengan alert stok menipis yang proaktif.
- **Glassmorphism Design**: Estetika modern menggunakan efek blur transparan, gradien vibrant, dan dark mode yang elegan.
- **Berkas Digital**: Manajemen dokumen digital untuk pegawai seperti ijazah, transkrip, dan foto profil.

---

## 🛠️ Tech Stack

- **Framework Core**: React 19 (Latest)
- **Styling**: Tailwind CSS (Native Framework)
- **Icons & Visuals**: React Icons (Hi/Tb)
- **State Management**: React Hook Form (Form Logic) & Context API (Themes)
- **Data Fetching**: Axios
- **Routing**: React Router DOM v6
- **Animations**: Tailwind Animate & Transitions

---

## ⚙️ Panduan Instalasi

### Prasyarat
- **Node.js**: Versi 18.x atau lebih baru (v20+ direkomendasikan).
- **npm**: v9.x atau lebih baru.

### Langkah-langkah
1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd inventory-fe
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan (Environment)**:
   Buat atau sesuaikan konfigurasi API pada `src/helper/api.js`. Secara default, aplikasi akan mencoba terhubung ke:
   ```javascript
   // Default Backend URL
   http://localhost:8080
   ```
   Atau buat file `.env` di root folder:
   ```env
   VITE_API_URL=http://your-backend-ip:8080
   ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi**:
   Buka browser dan akses [http://localhost:5173](http://localhost:5173).

---

## 📂 Struktur Proyek
- `src/components`: Komponen UI reusable.
- `src/pages`: Halaman utama aplikasi (Dashboard, Master, Login, dll).
- `src/layout`: Wrapper layout (Sidebar, Header, Footer).
- `src/helper`: Utilitas API dan manajemen user (Auth).
- `src/constants`: Konstanta untuk Menu, Otoritas, dan statis data lainnya.

---

## 📝 Catatan Perubahan
Riwayat pengembangan dan update fitur dapat dilihat di file [CHANGELOG.md](./CHANGELOG.md).

---

## 👤 Author
**Risdandi Ganda Gunawan**  
*Front-end Engineer & UI Enthusiast*
