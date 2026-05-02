import React, { useState, useEffect, useMemo } from 'react'

export const ThemeContext = React.createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem('dark')) {
      return JSON.parse(window.localStorage.getItem('dark')) ? 'dark' : 'light'
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false)

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    window.localStorage.setItem('dark', theme === 'dark')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  function toggleSideMenu() {
    setIsSideMenuOpen(!isSideMenuOpen)
  }

  function closeSideMenu() {
    setIsSideMenuOpen(false)
  }

  function toggleNotificationsMenu() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  function closeNotificationsMenu() {
    setIsNotificationsMenuOpen(false)
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  function closeProfileMenu() {
    setIsProfileMenuOpen(false)
  }

  function togglePagesMenu() {
    setIsPagesMenuOpen(!isPagesMenuOpen)
  }

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isSideMenuOpen,
      toggleSideMenu,
      closeSideMenu,
      isNotificationsMenuOpen,
      toggleNotificationsMenu,
      closeNotificationsMenu,
      isProfileMenuOpen,
      toggleProfileMenu,
      closeProfileMenu,
      isPagesMenuOpen,
      togglePagesMenu,
    }),
    [theme, isSideMenuOpen, isNotificationsMenuOpen, isProfileMenuOpen, isPagesMenuOpen]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
