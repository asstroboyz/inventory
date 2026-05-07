import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { UserHelper } from './helper/user'

import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import Dashboard from './pages/Dashboard'
import Forms from './pages/Forms'
import Cards from './pages/Cards'
import Charts from './pages/Charts'
import Buttons from './pages/Buttons'
import Modals from './pages/Modals'
import Tables from './pages/Tables'
import Page404 from './pages/404'
import Blank from './pages/Blank'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Bagian from './pages/Master/Bagian'
import Otoritas from './pages/Master/Otoritas'
import Pegawai from './pages/Master/Pegawai'
import JenisBarang from './pages/Master/JenisBarang'
import Merk from './pages/Master/Merk'
import Ruangan from './pages/Master/Ruangan'
import Satuan from './pages/Master/Satuan'
import Supplier from './pages/Master/Supplier'
import MasterBarang from './pages/Master/MasterBarang'
import TipeBarang from './pages/Master/TipeBarang'
import JenisTransaksi from './pages/Master/JenisTransaksi'
import Pengadaan from './pages/Transaksi/Pengadaan'
import Permintaan from './pages/Transaksi/Permintaan'
import Maintenance from './pages/Maintenance'
import TransIn from './pages/History/TransIn'
import TransOut from './pages/History/TransOut'
import StokBarang from './pages/Record/StokBarang'
import StokInventaris from './pages/Record/StokInventaris'
import Chat from './pages/Chat'

function PrivateRoute({ children }) {
  return UserHelper.isAuthenticated() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/forms" element={<PrivateRoute><Forms /></PrivateRoute>} />
          <Route path="/cards" element={<PrivateRoute><Cards /></PrivateRoute>} />
          <Route path="/charts" element={<PrivateRoute><Charts /></PrivateRoute>} />
          <Route path="/buttons" element={<PrivateRoute><Buttons /></PrivateRoute>} />
          <Route path="/modals" element={<PrivateRoute><Modals /></PrivateRoute>} />
          <Route path="/tables" element={<PrivateRoute><Tables /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/master/bagian" element={<PrivateRoute><Bagian /></PrivateRoute>} />
          <Route path="/master/otoritas" element={<PrivateRoute><Otoritas /></PrivateRoute>} />
          <Route path="/master/pegawai" element={<PrivateRoute><Pegawai /></PrivateRoute>} />
          <Route path="/master/jenis-barang" element={<PrivateRoute><JenisBarang /></PrivateRoute>} />
          <Route path="/master/merk" element={<PrivateRoute><Merk /></PrivateRoute>} />
          <Route path="/master/ruangan" element={<PrivateRoute><Ruangan /></PrivateRoute>} />
          <Route path="/master/satuan" element={<PrivateRoute><Satuan /></PrivateRoute>} />
          <Route path="/master/supplier" element={<PrivateRoute><Supplier /></PrivateRoute>} />
          <Route path="/master/barang" element={<PrivateRoute><MasterBarang /></PrivateRoute>} />
          <Route path="/master/tipe-barang" element={<PrivateRoute><TipeBarang /></PrivateRoute>} />
          <Route path="/master/jenis-transaksi" element={<PrivateRoute><JenisTransaksi /></PrivateRoute>} />
          <Route path="/transaksi/pengadaan" element={<PrivateRoute><Pengadaan /></PrivateRoute>} />
          <Route path="/transaksi/permintaan" element={<PrivateRoute><Permintaan /></PrivateRoute>} />
          <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
          <Route path="/history/in" element={<PrivateRoute><TransIn /></PrivateRoute>} />
          <Route path="/history/out" element={<PrivateRoute><TransOut /></PrivateRoute>} />
          <Route path="/record/barang" element={<PrivateRoute><StokBarang /></PrivateRoute>} />
          <Route path="/record/inventaris" element={<PrivateRoute><StokInventaris /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/blank" element={<PrivateRoute><Blank /></PrivateRoute>} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/404" element={<Page404 />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
