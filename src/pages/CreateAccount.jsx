import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'

const API_URL = import.meta.env.VITE_API_URL

const generateNip = () => `BPS-${Date.now()}`

const BAGIAN_OPTIONS = [
  { id: 1, code: 'BGN-IT', nama: 'Information Technology' },
  { id: 2, code: 'BGN-KU', nama: 'Keuangan' },
  { id: 3, code: 'BGN-TU', nama: 'Tata Usaha' },
  { id: 4, code: 'BGN-PG', nama: 'Pengadaan' },
  { id: 5, code: 'BGN-UM', nama: 'Umum' },
]

function CreateAccount() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    nama_depan: '',
    nama_belakang: '',
    nip: generateNip(),
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    bagian_id: '',
    jenis_kelamin: '',
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
        username: formData.username.trim(),
        nama_depan: formData.nama_depan.trim(),
        nama_belakang: formData.nama_belakang.trim(),
        nama_lengkap: `${formData.nama_depan} ${formData.nama_belakang}`.trim(),
        nip: formData.nip.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bagian_id: Number(formData.bagian_id),
        status: 'active',
        jenis_kelamin: formData.jenis_kelamin,
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
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    className="form-input"
                    placeholder="johndoe"
                    type="text"
                    name="username"
                    value={formData.username}
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
                      name="nama_depan"
                      value={formData.nama_depan}
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
                      name="nama_belakang"
                      value={formData.nama_belakang}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* NIP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    NIP
                  </label>
                  <input
                    className="form-input disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                    type="text"
                    name="nip"
                    value={formData.nip}
                    disabled
                  />
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

                {/* Bagian */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Bagian / Unit Kerja
                  </label>
                  <select
                    className="form-input dark:[color-scheme:dark]"
                    name="bagian_id"
                    value={formData.bagian_id}
                    onChange={handleChange}
                    required
                  >
                    <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100" value="" disabled>
                      Pilih bagian
                    </option>
                    {BAGIAN_OPTIONS.map((bagian) => (
                      <option
                        className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        key={bagian.id}
                        value={bagian.id}
                      >
                        {bagian.code} - {bagian.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    className="form-input dark:[color-scheme:dark]"
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleChange}
                    required
                  >
                    <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100" value="" disabled>
                      Pilih jenis kelamin
                    </option>
                    <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100" value="L">
                      Laki-laki
                    </option>
                    <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100" value="P">
                      Perempuan
                    </option>
                  </select>
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
