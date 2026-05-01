import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.100:8080'

function CreateAccount() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nickname: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      toast.error('Password dan Confirm Password tidak cocok.')
      return
    }

    if (!agreed) {
      toast.error('Anda harus menyetujui Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        nickname: formData.nickname,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        otoritas: 2,     // default: user biasa
        status: 'active',
      }

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error || data?.message || 'Registrasi gagal. Coba lagi.')
        return
      }

      toast.success('Registrasi berhasil! Silakan login.')

      // Sukses → arahkan ke login
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      toast.error('Tidak dapat terhubung ke server. Periksa koneksi Anda.', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row h-full min-h-[600px]">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Join Us</h2>
              <p className="text-lg text-purple-50 drop-shadow-md">Create an account to start managing your inventory like a pro.</p>
            </div>
          </div>

          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2 overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="mb-6 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  Create account
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Register to get started with your new account.
                </p>
              </div>


              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Nickname */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nickname
                  </label>
                  <input
                    className="form-input"
                    placeholder="johndoe"
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      className="form-input"
                      placeholder="John"
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      className="form-input"
                      placeholder="Doe"
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    className="form-input"
                    placeholder="john@example.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    className="form-input"
                    placeholder="+62812345678"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    className="form-input"
                    placeholder="••••••••"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    className="form-input"
                    placeholder="••••••••"
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Privacy Policy */}
                <div className="flex items-center mt-6">
                  <input
                    id="privacy-policy"
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <span className="font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline decoration-2 underline-offset-4"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
