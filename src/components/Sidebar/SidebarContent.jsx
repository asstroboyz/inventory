import { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { menus } from '../../constants/menus'
import {
  HiChartPie,
  HiBeaker,
  HiChevronDown,
  HiUsers,
  HiCube,
  HiRefresh,
  HiCog,
  HiSwitchHorizontal,
  HiShieldCheck,
  HiUserGroup,
  HiOfficeBuilding,
  HiTag,
  HiClipboardList,
  HiTruck,
  HiLogin,
  HiLogout,
  HiCollection,
  HiArchive,
  HiPlus,
  HiBriefcase,
  HiHome
} from 'react-icons/hi'

function SidebarContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { closeSideMenu } = useContext(ThemeContext)

  // State for Dropdowns
  const [openMenus, setOpenMenus] = useState({
    masterPegawai: false,
    masterProduct: false,
    history: false,
    transaksi: false,
    masterLokasi: false,
    monitoringStok: false,
    development: false
  })

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])

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

  const isActive = (path) => location.pathname === path

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400 flex flex-col h-full">
      <Link to="/" className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200 flex gap-[2px]">
        {"asstroboyz".split("").map((char, i) => (
          <span key={i} className="inline-block" style={{ animation: `wave 1.5s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{char}</span>
        ))}
      </Link>

      {/* Mobile Search */}
      <div className="px-6 mt-6 md:hidden">
        <div className="relative w-full text-purple-600">
          <input
            className="w-full pl-8 pr-2 py-2 text-sm text-gray-700 bg-gray-100 border-transparent rounded-md dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:shadow-outline-purple form-input"
            type="text"
            placeholder="Search menus..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {results.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800 z-50 overflow-hidden border border-gray-100 dark:border-gray-700">
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

      <ul className="mt-6 flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {/* --- DASHBOARD --- */}
        <MainMenuItem to="/dashboard" name="Dashboard" icon={<HiChartPie className="w-5 h-5" />} active={isActive('/dashboard')} />



        {/* --- MASTER PEGAWAI --- */}
        <DropdownMenuItem
          name="Master Pegawai"
          icon={<HiUsers className="w-5 h-5" />}
          isOpen={openMenus.masterPegawai}
          onClick={() => toggleMenu('masterPegawai')}
        >
          <SubMenuItem to="/master/otoritas" name="Otoritas" icon={<HiShieldCheck className="w-4 h-4" />} />
          <SubMenuItem to="/master/pegawai" name="Pegawai" icon={<HiUserGroup className="w-4 h-4" />} />
          <SubMenuItem to="/master/bagian" name="Bagian" icon={<HiOfficeBuilding className="w-4 h-4" />} />
        </DropdownMenuItem>

        {/* --- MASTER PRODUCT --- */}
        <DropdownMenuItem
          name="Master Product"
          icon={<HiCube className="w-5 h-5" />}
          isOpen={openMenus.masterProduct}
          onClick={() => toggleMenu('masterProduct')}
        >
          <SubMenuItem to="/master/barang" name="Barang" icon={<HiArchive className="w-4 h-4" />} />
          <SubMenuItem to="/master/jenis-barang" name="Jenis Barang" icon={<HiTag className="w-4 h-4" />} />
          <SubMenuItem to="/master/merk" name="Merk" icon={<HiCollection className="w-4 h-4" />} />
          <SubMenuItem to="/master/satuan" name="Satuan" icon={<HiCube className="w-4 h-4" />} />
          <SubMenuItem to="/master/supplier" name="Supplier" icon={<HiTruck className="w-4 h-4" />} />
        </DropdownMenuItem>

        {/* --- MASTER LOKASI --- */}
        <DropdownMenuItem
          name="Master Lokasi"
          icon={<HiHome className="w-5 h-5" />}
          isOpen={openMenus.masterLokasi}
          onClick={() => toggleMenu('masterLokasi')}
        >
          <SubMenuItem to="/master/ruangan" name="Ruangan" icon={<HiOfficeBuilding className="w-4 h-4" />} />
        </DropdownMenuItem>

        {/* --- TRANSAKSI --- */}
        <DropdownMenuItem
          name="Transaksi"
          icon={<HiSwitchHorizontal className="w-5 h-5" />}
          isOpen={openMenus.transaksi}
          onClick={() => toggleMenu('transaksi')}
        >
          <SubMenuItem to="/transaksi/permintaan" name="Permintaan Barang" icon={<HiClipboardList className="w-4 h-4" />} />
          <SubMenuItem to="/transaksi/pengadaan" name="Pengadaan Barang" icon={<HiPlus className="w-4 h-4" />} />
        </DropdownMenuItem>

        {/* --- MONITORING STOK --- */}
        <DropdownMenuItem
          name="Monitoring Stok"
          icon={<HiCollection className="w-5 h-5" />}
          isOpen={openMenus.monitoringStok}
          onClick={() => toggleMenu('monitoringStok')}
        >
          <SubMenuItem to="/record/barang" name="Stok ATK" icon={<HiArchive className="w-4 h-4" />} />
          <SubMenuItem to="/record/inventaris" name="Daftar Aset" icon={<HiBriefcase className="w-4 h-4" />} />
        </DropdownMenuItem>

        {/* --- PEMELIHARAAN (Asset Management) --- */}
        <MainMenuItem to="/maintenance" name="Manajemen Aset" icon={<HiCog className="w-5 h-5" />} active={isActive('/maintenance')} />

        {/* --- HISTORY --- */}
        <DropdownMenuItem
          name="History"
          icon={<HiRefresh className="w-5 h-5" />}
          isOpen={openMenus.history}
          onClick={() => toggleMenu('history')}
        >
          <SubMenuItem to="/history/in" name="Trans In" icon={<HiLogin className="w-4 h-4" />} />
          <SubMenuItem to="/history/out" name="Trans Out" icon={<HiLogout className="w-4 h-4" />} />
        </DropdownMenuItem>

        {/* --- DEVELOPMENT DROPDOWN --- */}
        <div className="px-6 my-6">
          <div className="h-[3px] w-full bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>

        <div className="">
          <DropdownMenuItem
            name="Development"
            icon={<HiBeaker className="w-5 h-5 opacity-50" />}
            isOpen={openMenus.development}
            onClick={() => toggleMenu('development')}
            colorClass="text-gray-400"
          >
            <SubMenuItem to="/forms" name="Forms" />
            <SubMenuItem to="/cards" name="Cards" />
            <SubMenuItem to="/charts" name="Charts" />
            <SubMenuItem to="/buttons" name="Buttons" />
            <SubMenuItem to="/modals" name="Modals" />
            <SubMenuItem to="/tables" name="Tables" />
          </DropdownMenuItem>
        </div>
      </ul>

    </div>
  )
}

function MainMenuItem({ to, name, icon, active }) {
  return (
    <li className="relative px-6 py-3">
      {active && (
        <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
      )}
      <Link
        className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${active ? 'text-gray-800 dark:text-gray-100' : ''}`}
        to={to}
      >
        {icon}
        <span className="ml-4">{name}</span>
      </Link>
    </li>
  )
}

function DropdownMenuItem({ name, icon, isOpen, onClick, children, colorClass = "text-gray-500" }) {
  return (
    <li className="relative px-6 py-3">
      <button
        className={`inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${colorClass}`}
        onClick={onClick}
        aria-haspopup="true"
      >
        <span className="inline-flex items-center">
          {icon}
          <span className="ml-4">{name}</span>
        </span>
        <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200">
          {children}
        </ul>
      )}
    </li>
  )
}

function SubMenuItem({ to, name, active, icon }) {
  return (
    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
      <Link className={`flex items-center w-full ${active ? 'text-gray-800 dark:text-gray-100 font-bold' : ''}`} to={to}>
        {icon && <span className="mr-3 opacity-70">{icon}</span>}
        <span>{name}</span>
      </Link>
    </li>
  )
}

export default SidebarContent
