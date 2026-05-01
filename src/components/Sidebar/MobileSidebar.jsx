import React, { useContext } from 'react'
import SidebarContent from './SidebarContent'
import { ThemeContext } from '../../context/ThemeContext'

function MobileSidebar() {
  const { isSideMenuOpen, closeSideMenu } = useContext(ThemeContext)

  return (
    <>
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          onClick={closeSideMenu}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden transition-all duration-300 ${
          isSideMenuOpen ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-20 pointer-events-none'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

export default MobileSidebar
