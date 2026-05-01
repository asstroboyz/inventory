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
        <main className="h-full overflow-y-auto flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-8 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase font-black text-gray-400 dark:text-gray-600 select-none pointer-events-none">
              Inventory Management System <span className="mx-2 text-purple-500/50">•</span> v1.0.0
            </p>
            <p className="text-[9px] mt-2 font-bold text-gray-300 dark:text-gray-700 tracking-wider select-none uppercase">
              &copy; 2026 &bull; Crafted with Passion by Risdandi Ganda Gunawan
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Layout
