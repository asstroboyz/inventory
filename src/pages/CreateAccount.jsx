import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'

function CreateAccount() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock register logic - directly navigate to login or dashboard
    navigate('/login')
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
          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  Create account
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Register to get started with your new account.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    className="form-input"
                    placeholder="John Doe"
                    type="text"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    className="form-input"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    className="form-input"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    className="form-input"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <span className="font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </span>
                </div>

                <button type="submit" className="btn-primary mt-6">
                  Create account
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or register with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Github
                </button>
                <button className="btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                  Twitter
                </button>
              </div>

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
