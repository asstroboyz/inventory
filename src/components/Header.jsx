import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { HiChatAlt2 } from 'react-icons/hi'
import { ThemeContext } from '../context/ThemeContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserHelper } from '../helper/user'
import { menus } from '../constants/menus'
import { BaseUrl } from '../helper/api'

function Header() {
  const {
    theme,
    toggleTheme,
    toggleSideMenu,
    closeSideMenu,
    isProfileMenuOpen,
    toggleProfileMenu,
    closeProfileMenu
  } = useContext(ThemeContext)

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const user = UserHelper.getUser()
  const [unreadCount, setUnreadCount] = useState(0)
  const [proposalCount, setProposalCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const config = UserHelper.axiosConfig()
        if (!config) return
        const res = await axios.get(`${BaseUrl}/api/chat/rooms`, config)
        const rooms = res.data.data || []
        
        const totalUnread = rooms.reduce((acc, room) => acc + (room.unread_count || 0), 0)
        const totalProposals = rooms.reduce((acc, room) => acc + (room.proposal_count || 0), 0)
        
        setUnreadCount(totalUnread)
        setProposalCount(totalProposals)
      } catch (_err) {
        // Silently fail
      }
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 0) {
      const filtered = menus.filter((menu) =>
        menu.name.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }

  const handleSelect = (path) => {
    navigate(path)
    setSearchQuery('')
    setResults([])
    closeSideMenu()
  }

  const picPath = user?.berkas?.find(b => b.jenis === 'foto_profil')?.path

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSideMenu}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        </button>

        {/* Search input - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
              type="text"
              placeholder="Search for menus..."
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            {results.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-md shadow-lg dark:bg-gray-700 z-50 overflow-hidden border border-gray-100 dark:border-gray-600">
                <ul className="py-1">
                  {results.map((result) => (
                    <li key={result.path}>
                      <button
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-600 transition-colors duration-150"
                        onClick={() => handleSelect(result.path)}
                      >
                        {result.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleTheme}
              aria-label="Toggle color mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
          </li>

          {/* Chat Icon */}
          <li className="flex">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple text-purple-600 dark:text-purple-300 transition-colors duration-150"
              onClick={() => navigate('/chat')}
              aria-label="Chat"
            >
              <HiChatAlt2 className="w-6 h-6" />
              {(unreadCount > 0 || proposalCount > 0) && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                  {unreadCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full border-2 border-white dark:border-gray-800"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {proposalCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-blue-600 rounded-full border-2 border-white dark:border-gray-800"
                    >
                      {proposalCount > 99 ? '99+' : proposalCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          </li>

          {/* Profile menu */}
          <li className="relative">
            <button
              className="flex items-center gap-2 align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={toggleProfileMenu}
            >
              <span className="hidden md:inline text-sm font-semibold text-gray-700 dark:text-gray-200">
                {user ? `${user.nama_depan || ''} ${user.nama_belakang || ''}`.trim() || 'User' : 'User'}
              </span>
              <img
                className="object-cover w-8 h-8 rounded-full border-2 border-transparent hover:border-purple-400 transition-colors duration-150"
                src={picPath ? `${BaseUrl}${picPath}` : 'https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82'}
                alt=""
                aria-hidden="true"
              />
            </button>
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700 z-50"
                onClick={closeProfileMenu}
              >
                <Link
                  className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  to="/profile"
                >
                  <svg className="w-4 h-4 mr-3" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Profile</span>
                </Link>
                <Link
                  className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  to="/change-password"
                >
                  <svg className="w-4 h-4 mr-3" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                  <span>Change Password</span>
                </Link>
                <button
                  className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  onClick={() => {
                    UserHelper.logout()
                    toast.success('Berhasil keluar.')
                    navigate('/login')
                  }}
                >
                  <svg className="w-4 h-4 mr-3" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
