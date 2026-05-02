import Cookies from 'js-cookie'

/**
 * Helper to manage User and Token using Cookies
 */
export const UserHelper = {
  // --- Token Management ---
  setToken: (token) => {
    Cookies.set('token', token, { expires: 1 })
  },

  getToken: () => {
    return Cookies.get('token')
  },

  // --- User Data Management ---
  setUser: (userData) => {
    Cookies.set('user', JSON.stringify(userData), { expires: 1 })
  },

  getUser: () => {
    const user = Cookies.get('user')
    return user ? JSON.parse(user) : null
  },

  // --- Auth Checks ---
  isAuthenticated: () => {
    return !!Cookies.get('token')
  },

  // --- Logout ---
  logout: () => {
    Cookies.remove('token')
    Cookies.remove('user')
    // Optional: clear localStorage if any other data is stored there
    localStorage.clear()
  },

  // --- Shortcuts ---
  getNickname: () => UserHelper.getUser()?.nickname || '',
  getEmail: () => UserHelper.getUser()?.email || '',
  getOtoritas: () => UserHelper.getUser()?.otoritas || null,
  
  // --- Header Helpers ---
  authHeader: () => ({
    'Authorization': UserHelper.getToken() || ''
  }),

  // Header with Auth + Content-Type JSON
  jsonHeader: () => ({
    'Content-Type': 'application/json',
    ...UserHelper.authHeader()
  }),

}
