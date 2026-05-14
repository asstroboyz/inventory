# Changelog - Inventory Management System (UI / UX)

---

### **Mei 14, 2026**
- **Pure UI/UX Overhaul - Pengadaan (Procurement) Module**:
    *   **Premium Transaction Form UX**: Implementasi modal pengadaan baru dengan sistem **Dynamic Row**; memungkinkan penambahan/penghapusan baris item secara instan tanpa *page reload*.
    *   **Strategic Layout Optimization**: 
        - Pemindahan data **Spesifikasi** ke kolom mandiri (**Dedicated Column**) untuk menghilangkan tumpukan teks dan meningkatkan keterbacaan data item.
        - Re-strukturisasi identitas barang dengan format `[KODE] - Nama Barang` (Dash Separator) untuk kejelasan visual yang lebih baik.
    *   **Advanced Expanded Table UX**: 
        - Desain baris tabel yang dapat melebar (**Expanded Row**) dengan *nested table* yang memiliki efek hover halus dan border aksen ungu.
        - Penggunaan font **Monospace** pada seluruh data numerik dan kode untuk standarisasi audit visual yang presisi.
    *   **Visual Engagement & Feedback**: 
        - Implementasi **Pulse Animation** pada status transaksi untuk memberikan sinyal visual yang dinamis.
        - Integrasi grid informasi premium dengan ikon `HiShoppingCart`, `HiClipboardList`, dan `HiClock` untuk navigasi informasi yang lebih intuitif.
    *   **Clean Labeling UX**: Penghapusan field-field redundan (seperti Periode/Tanggal Perolehan) untuk meminimalkan beban kognitif pengguna selama proses pengadaan.
    *   **Dynamic Inventory Integration**: Optimasi UI `AsyncSelect` yang dikalibrasi khusus untuk pencarian katalog **Inventaris/Aset** secara real-time.

---


### **Mei 12, 2026**
- **Inventory & Inspection UX**:
    *   **Smart Inspection Warning System**: Implementasi kolom **"Pemeriksaan"** pada tabel Stok Inventaris yang otomatis menganalisis riwayat inspeksi terakhir.
    *   **Visual Alert Indicators**: 
        - Badge status warna-warni (🔴 Terlambat, 🟡 Segera, 🟢 Aman) untuk identifikasi cepat jadwal pemeliharaan.
        - Penambahan **Pulse Animation** (titik berkedip) pada status krusial untuk menarik perhatian operator secara instan.
        - Tooltip/Sub-label dinamis yang menunjukkan selisih hari (misal: "3 hari lagi" atau "12 hari lalu").
- **Real-time Connectivity & Performance**:
    *   **Header WebSocket Sync**: Migrasi total sistem notifikasi unread chat di Header dari *polling* 10 detik ke **WebSocket Event-Driven**. Update jumlah pesan kini terjadi dalam milidetik tanpa beban request berkala ke server.
    *   **Resilient Connection Logic**: Implementasi mekanisme *auto-reconnect* pintar pada Header untuk menjamin sinkronisasi data tetap berjalan meskipun koneksi internet sempat terganggu.
- **Authentication & Security UX**:
    *   **Enhanced Login Security**: 
        - Penambahan fitur **Show/Hide Password** dengan ikon mata interaktif untuk kenyamanan input pengguna.
        - Refactoring layout form login dengan memindahkan link "Lupa Password" ke bawah input field untuk tampilan yang lebih bersih dan ergonomis.
    *   **Functional Password Recovery**: 
        - Aktivasi fitur **Lupa Password** dengan UI premium (glassmorphism & responsive layout).
        - Integrasi alur reset password otomatis berbasis **Tanggal Lahir (YYYYMMDD)** yang disinkronkan langsung dengan database pusat.
        - Feedback visual menggunakan *React Hot Toast* untuk setiap status permintaan pemulihan akun.

---

- **Chat UX & Notifications System**:
    - **Read Receipt Integration**: Implementasi status pesan ala WhatsApp (centang dua abu/ungu untuk *terkirim*, centang dua biru untuk *dibaca*) berbasis data `last_read_message_id`.
    - **Intelligent Audio & Visual Notifs**: 
        - Penambahan Toast notification yang dinamis menampilkan Nama Pengirim dan Cuplikan Pesan saat ada chat baru.
        - Integrasi audio notifikasi (`notif.wav`) yang dilengkapi dengan *Audio Unlocking Workaround* untuk menembus kebijakan Auto-Play browser.
        - Animasi *highlight pulse* ungu pada *bubble* pesan yang baru saja tiba.
    - **Smart Unread Badge**: Otomatis menghilangkan badge *unread count* merah secara real-time dari sidebar tanpa menunggu refresh ketika obrolan di-klik.
    - **Date Separators**: Penambahan elemen pemisah waktu (Hari ini, Kemarin, Nama Hari) secara dinamis di antara pesan untuk meningkatkan orientasi pembacaan histori chat.
    - **Connection Resiliency**: Setup WebSocket *Auto-Reconnect* berinterval 3 detik jika terputus, dilengkapi mekanisme *fallback sync* per 15 detik agar UI selalu *up-to-date*.



### **Mei 8, 2026**
- **Multimedia Chat & UX**:
    - **Visual Attachments Rendering**: 
        - Integrasi preview gambar langsung di dalam gelembung chat dengan efek *hover-to-zoom*.
        - Implementasi kartu dokumen premium untuk file non-gambar (PDF, Word, dll) dengan ikon yang representatif dan fitur download sekali klik.
    - **Advanced Action Menus**:
        - **Sidebar Context Menu**: Implementasi klik kanan (Right-Click) pada daftar percakapan untuk aksi cepat (Hapus Chat, Keluar Grup, Bubarkan Grup).
        - **Flipped Message Menu**: Re-engineering posisi menu aksi pesan agar terbuka ke atas (`bottom-full`) untuk mencegah menu terpotong oleh input bar.
    - **Room Info & Management Sidebar**:
        - Penambahan tab **"Info"** pada Sidebar Kanan yang menampilkan profil room, daftar anggota lengkap dengan badge Admin, dan pengaturan manajemen room.
        - **Disband/Leave Functionality**: Fitur untuk membubarkan grup (oleh Admin) atau keluar dari grup (oleh Member) dengan dialog konfirmasi SweetAlert2.
    - **UX Ergonimics & Polish**:
        - **Alphabetical User Sorting**: Otomatis mengurutkan daftar pegawai (A-Z) pada modal pesan baru untuk mempermudah pencarian.
        - **Type-Safe Filtering**: Optimasi filter ID menggunakan `Number()` casting untuk mencegah *mismatch* data string/integer.
    - **Performance & Lifecycle Stability**:
        - Refactoring besar-besaran seluruh fungsi fetching menggunakan `useCallback` untuk performa rendering yang lebih mulus dan stabil.
        - Pembersihan *cascading renders* dan perbaikan peringatan *missing dependency* pada React Hooks.
    - **WebSocket Real-time Architecture**: Transisi penuh dari sistem polling ke koneksi WebSocket murni untuk sinkronisasi pesan instan.
    - **Advanced Message Interaction**: 
        - **Quoted Replies**: Fitur "Balas Pesan" yang memungkinkan pengguna mengutip pesan sebelumnya.
        - **Smart Message Actions**: Menu aksi melayang (hover) untuk balas dan hapus pesan dengan antarmuka yang lebih modern.
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
