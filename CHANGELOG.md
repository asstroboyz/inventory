# Changelog - Inventory Management System (Frontend)

Semua perubahan penting pada bagian antarmuka pengguna (Frontend) akan dicatat di file ini.

---

### **Mei 3, 2026**
- **Role-Based Dashboard (RBAC)**:
    - Implementasi tampilan dashboard dinamis berdasarkan peran pengguna (Super Admin, Admin, Kepala BPS, Petugas Pengadaan, dan Staf).
    - Penyesuaian *Stat Cards* dan *Quick Actions* yang relevan untuk masing-masing otoritas.
- **Improved Authentication UX**:
    - Penanganan pesan error login yang lebih deskriptif (misal: notifikasi akun dinonaktifkan).
    - Implementasi password otomatis berbasis tanggal lahir (`YYYYMMDD`) untuk registrasi pegawai baru melalui Master Pegawai.
- **Documentation Refactoring**:
    - Pemisahan riwayat pengerjaan ke dalam `CHANGELOG.md`.
    - Pembaruan `README.md` untuk fokus pada deskripsi proyek dan panduan instalasi.

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
