import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Forms = lazy(() => import('./pages/Forms'))
const Cards = lazy(() => import('./pages/Cards'))
const Charts = lazy(() => import('./pages/Charts'))
const Buttons = lazy(() => import('./pages/Buttons'))
const Modals = lazy(() => import('./pages/Modals'))
const Tables = lazy(() => import('./pages/Tables'))
const Page404 = lazy(() => import('./pages/404'))
const Blank = lazy(() => import('./pages/Blank'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-purple-600">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/modals" element={<Modals />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />


            <Route path="/" element={<Navigate to="/dashboard" replace />} />


            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App
