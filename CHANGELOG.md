# Changelog - Inventory Management System (UI / UX)

Semua perubahan penting pada bagian antarmuka pengguna (UI / UX) akan dicatat di file ini.

---

### **Mei 8, 2026**
- **Enterprise Chat System (ProChat) Integration**:
    - **Real-time Messaging**: Implementasi sistem chat internal dengan fitur polling cerdas untuk sinkronisasi pesan tanpa refresh.
    - **Item Proposal Workflow**: Fitur usulan barang (Inventory/Katalog/Manual) langsung di dalam percakapan chat.
    - **One-Click Approval**: Pimpinan dapat menyetujui usulan barang langsung dari gelembung chat, yang secara otomatis masuk ke keranjang pengadaan.
    - **Mobile-First Optimization**:
        - Implementasi *Backdrop Overlay* dan *Toggle Sidebar* (Kiri & Kanan) yang responsif untuk kenyamanan pengguna smartphone.
        - Optimasi scroll dengan `overscroll-contain` untuk mencegah "bounce" layar yang tidak diinginkan.
    - **Enhanced Visuals & Notifications**:
        - Integrasi foto profil user pada seluruh komponen chat (Sidebar, Header, dan Bubble Chat).
        - **Live Badge Notifications**: Penambahan indikator jumlah pesan belum dibaca dan usulan barang pada Header utama aplikasi.
    - **WebSocket Real-time Architecture**: Transisi penuh dari sistem polling ke koneksi WebSocket murni untuk sinkronisasi pesan instan.
    - **Advanced Message Interaction**: 
        - **Quoted Replies**: Fitur "Balas Pesan" yang memungkinkan pengguna mengutip pesan sebelumnya untuk konteks percakapan yang lebih jelas.
        - **Smart Message Actions**: Menu aksi melayang (hover) untuk balas dan hapus pesan dengan antarmuka yang lebih modern (menggunakan ikon Trash untuk hapus).
    - **Debounce-Free Search**: Penghapusan jeda (debounce) pada pencarian barang untuk pengalaman browsing katalog yang tanpa hambatan (zero-latency).
    - **Code Integrity & Stability**: 
        - Perbaikan kritis pada isu *access before declaration* (hoisting).
        - Pembersihan dependensi unused icons dan optimasi catch-block untuk debugging yang lebih baik.
        - Perbaikan isu history chat yang tidak muncul saat pertama kali room dipilih.

### **Mei 7, 2026**
- **Permintaan Barang (Request) Module Overhaul**:
    - **Aesthetic Expandable Table**: Implementasi baris tabel yang dapat melebar (expand) dengan desain kartu premium untuk melihat detail item barang secara langsung tanpa membuka modal.
    - **Create Permintaan Feature**: Penambahan fitur pembuatan permintaan barang baru dengan sistem *Multi-Item Detail*.
    - **Dynamic Row Input**: Implementasi penambahan baris barang secara dinamis pada modal pembuatan permintaan.
    - **Smart Search Integration**: Penggunaan `AsyncSelect` (dengan pola *Promise return*) untuk pencarian stok barang yang lebih reliabel dan cepat.
    - **UI/UX Polishing**: 
        - Penggunaan ikon `FaRegPlusSquare` untuk tombol tambah yang lebih clean.
        - Perbaikan isu *z-index* dan *menu portal* pada dropdown di dalam modal dan tabel.

### **Mei 6, 2026**
- **Maintenance Module Synchronization**:
    - Sinkronisasi UI / UX dengan struct backend terbaru (`Maintenance_r`).
    - Pembaruan field data: `tanggal_jadwal`, `tanggal_selesai`, `hasil_servis`, dan penyesuaian status `Pending`.
    - Perbaikan tampilan `AsyncSelect` agar menampilkan nama aset secara instan setelah dipilih.
- **Data Fetching Optimization**:
    - Migrasi seluruh fungsi `loadOptions` pada `AsyncSelect` ke pola *Async/Await Promise* untuk stabilitas rendering di React 19.

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
