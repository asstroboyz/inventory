import React, { useContext } from 'react'
import DesktopSidebar from '../components/Sidebar/DesktopSidebar'
import MobileSidebar from '../components/Sidebar/MobileSidebar'
import Header from '../components/Header'
import { ThemeContext } from '../context/ThemeContext'

function Layout({ children }) {
  const { isSideMenuOpen } = useContext(ThemeContext)

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? 'overflow-hidden' : ''}`}
    >
      <DesktopSidebar />
      <MobileSidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
