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
