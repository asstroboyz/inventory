import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageLight from '../assets/img/forgot-password-office.jpeg'
import ImageDark from '../assets/img/forgot-password-office-dark.jpeg'

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.100:8080'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Gagal mengirim permintaan reset password.')
        return
      }

      toast.success(data.message || 'Permintaan berhasil dikirim!')
      setEmail('')
    } catch (error) {
      toast.error('Tidak dapat terhubung ke server. Periksa koneksi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          <div className="relative hidden md:block md:w-1/2 overflow-hidden">
            <img
              aria-hidden="true"
              className="absolute inset-0 object-cover w-full h-full transform scale-105 hover:scale-100 transition-transform duration-700 dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="absolute inset-0 hidden object-cover w-full h-full transform scale-105 hover:scale-100 transition-transform duration-700 dark:block"
              src={ImageDark}
              alt="Office"
            />
            <div className="absolute inset-0 bg-purple-600/20 mix-blend-multiply"></div>
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full max-w-sm">
              <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll help you reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Recover password'
                  )}
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Link
                  className="flex items-center justify-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline decoration-2 underline-offset-4"
                  to="/login"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to login
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
