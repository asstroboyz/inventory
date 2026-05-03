import { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../layout/Layout'
import { BaseUrl } from '../helper/api'
import { UserHelper } from '../helper/user'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { HiCube, HiExclamation, HiTrendingUp, HiUsers, HiTrendingDown, HiClipboardList, HiClock, HiDotsVertical, HiBell, HiPlus, HiChartBar, HiTable, HiX, HiTruck, HiShoppingCart, HiDocumentText, HiOutlineFolderOpen, HiSearch } from 'react-icons/hi'
import { OTORITAS } from '../constants/otoritas'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const StatCard = ({ title, value, icon, trend, color, trendColor }) => (
  <div className="relative overflow-hidden p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all hover:scale-[1.02] duration-300 group">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 bg-${color}-500/5 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-colors`}></div>
    <div className="flex justify-between items-start z-10 relative">
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</p>
        <h3 className="mt-2 text-3xl font-black text-gray-800 dark:text-gray-100">{value}</h3>
        {trend && (
          <div className={`mt-3 flex items-center gap-1 text-xs font-bold ${trendColor}`}>
            {trend.startsWith('+') ? <HiTrendingUp className="w-4 h-4" /> : <HiTrendingDown className="w-4 h-4" />}
            {trend} <span className="text-gray-400 font-normal">vs bulan lalu</span>
          </div>
        )}
      </div>
      <div className={`p-4 bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 rounded-2xl shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
)

const RecentActivity = ({ title, time, user, status }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${status === 'Success' || status === 'Approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
        status === 'Pending' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
        <HiClipboardList className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 transition-colors">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
            <HiClock className="w-3 h-3" /> {time}
          </span>
          <span className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">{user}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${status === 'Success' || status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
        status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
          'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
        }`}>{status}</span>
      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <HiDotsVertical className="w-4 h-4" />
      </button>
    </div>
  </div>
)

function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('Admin')
  const [userRole, setUserRole] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [stats, setStats] = useState({
    total_barang: 0,
    low_stock_count: 0,
    total_pegawai: 0,
    total_transaksi: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [stockAlerts, setStockAlerts] = useState([])
  const [analytics, setAnalytics] = useState({
    transaction_trend: [],
    category_distribution: []
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      const config = UserHelper.axiosConfig()
      if (!config) return

      try {
        const res = await axios.get(`${BaseUrl}/api/dashboard/`, config)

        // Menggunakan setUserName setelah await (asynchronous) untuk menghindari warning cascading renders
        const user = UserHelper.getUser()
        if (user) {
          setUserName(user.first_name || user.nickname || 'User')
          setUserRole(user.otoritas_id)
        }

        const { stats, recent_activities, stock_alerts, analytics } = res.data.data
        setStats(stats)
        // Sort activities by CreatedAt descending
        const sortedActs = (recent_activities || []).sort((a, b) => moment(b.created_at).diff(moment(a.created_at)))
        setRecentActivities(sortedActs)
        setStockAlerts(stock_alerts || [])
        setAnalytics(analytics || { transaction_trend: [], category_distribution: [] })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  // Chart Data Preparation
  const trendLabels = [...new Set((analytics?.transaction_trend || []).map(d => d?.date))]
  const trendIn = trendLabels.map(date => {
    const found = (analytics?.transaction_trend || []).find(d => d?.date === date && d?.type === 'IN')
    return found ? found.total : 0
  })
  const trendOut = trendLabels.map(date => {
    const found = (analytics?.transaction_trend || []).find(d => d?.date === date && d?.type === 'OUT')
    return found ? found.total : 0
  })

  const lineData = {
    labels: trendLabels.map(d => moment(d).format('DD MMM')),
    datasets: [
      {
        label: 'Barang Masuk',
        data: trendIn,
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Barang Keluar',
        data: trendOut,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  const doughnutData = {
    labels: (analytics?.category_distribution || []).map(d => d?.name),
    datasets: [
      {
        data: (analytics?.category_distribution || []).map(d => d?.total),
        backgroundColor: [
          '#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'
        ],
        borderWidth: 0,
      }
    ]
  }

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8 relative">
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-6 top-32 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700 flex justify-between items-center">
              <h5 className="font-black text-sm text-gray-800 dark:text-white uppercase tracking-wider">Notifikasi</h5>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><HiX className="w-5 h-5" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {stockAlerts.length === 0 ? (
                <p className="text-center py-8 text-gray-500 text-xs font-bold">Tidak ada notifikasi baru.</p>
              ) : (
                (stockAlerts || []).map((item, i) => (
                  <div key={i} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all border-b last:border-0 dark:border-gray-700 flex gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg h-fit"><HiExclamation className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Stok Menipis!</p>
                      <p className="text-[10px] text-gray-500 mt-1">{item.master_detail?.master_data?.nama_brg || 'Barang'} tersisa {item.stok}.</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between my-10 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
              Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">{userName}!</span>
              <span className="animate-bounce">👋</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ini adalah ringkasan inventaris Anda untuk hari ini.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center gap-1 border border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <HiTable className="w-4 h-4" /> Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <HiChartBar className="w-4 h-4" /> Analytics
              </button>
            </div>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-gray-500 relative border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${showNotifications ? 'ring-2 ring-purple-600' : ''}`}
            >
              <HiBell className="w-6 h-6" />
              {stockAlerts.length > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid - Role Based */}
        <div className="grid gap-6 mb-10 md:grid-cols-2 xl:grid-cols-4">
          {(userRole === OTORITAS.SUPER_ADMIN || userRole === OTORITAS.ADMIN || userRole === OTORITAS.KEPALA_BPS) && (
            <>
              <StatCard
                title="Total Barang"
                value={stats.total_barang.toLocaleString()}
                icon={<HiCube className="w-8 h-8" />}
                color="purple"
              />
              <StatCard
                title="Stok Menipis"
                value={stats.low_stock_count}
                icon={<HiExclamation className="w-8 h-8" />}
                color="red"
              />
              <StatCard
                title="Total Transaksi"
                value={stats.total_transaksi.toLocaleString()}
                icon={<HiTrendingUp className="w-8 h-8" />}
                color="blue"
              />
              <StatCard
                title="Total Pegawai"
                value={stats.total_pegawai}
                icon={<HiUsers className="w-8 h-8" />}
                color="orange"
              />
            </>
          )}

          {(userRole === OTORITAS.STAF || userRole === OTORITAS.STAF_TATA_USAHA) && (
            <>
              <StatCard
                title="Barang Habis Pakai"
                value={stats.total_barang}
                icon={<HiShoppingCart className="w-8 h-8" />}
                color="green"
              />
              <StatCard
                title="Permintaan Saya"
                value="0"
                icon={<HiDocumentText className="w-8 h-8" />}
                color="blue"
              />
              <StatCard
                title="Stok Tersedia"
                value={stats.total_barang - stats.low_stock_count}
                icon={<HiCube className="w-8 h-8" />}
                color="purple"
              />
              <StatCard
                title="Pesan Baru"
                value="0"
                icon={<HiBell className="w-8 h-8" />}
                color="orange"
              />
            </>
          )}

          {userRole === OTORITAS.PETUGAS_PENGADAAN && (
            <>
              <StatCard
                title="Stok Menipis"
                value={stats.low_stock_count}
                icon={<HiExclamation className="w-8 h-8" />}
                color="red"
              />
              <StatCard
                title="Pengadaan Masuk"
                value={stats.total_transaksi}
                icon={<HiTruck className="w-8 h-8" />}
                color="blue"
              />
              <StatCard
                title="Daftar Supplier"
                value="8"
                icon={<HiUsers className="w-8 h-8" />}
                color="purple"
              />
              <StatCard
                title="Target PO"
                value="12"
                icon={<HiClipboardList className="w-8 h-8" />}
                color="orange"
              />
            </>
          )}
        </div>

        {activeTab === 'overview' ? (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white leading-tight mb-4">Optimalkan Manajemen <br />Aset Anda Sekarang!</h3>
                  <p className="text-purple-100 text-sm max-w-md opacity-80 leading-relaxed mb-6">Pantau setiap pergerakan barang, atur permintaan stok, dan kelola aset inventaris perusahaan dengan lebih efisien dalam satu dashboard terpusat.</p>
                  <div className="flex gap-4">
                    <button onClick={() => navigate('/master/barang')} className="px-6 py-3 bg-white text-purple-700 rounded-2xl text-sm font-black shadow-xl hover:bg-purple-50 transition-all active:scale-95">Mulai Record Baru</button>
                    <button onClick={() => setActiveTab('analytics')} className="px-6 py-3 bg-white/20 text-white rounded-2xl text-sm font-black backdrop-blur-sm hover:bg-white/30 transition-all">Lihat Laporan</button>
                  </div>
                </div>
                <HiCube className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                  <h4 className="text-lg font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Aktivitas Terakhir
                  </h4>
                  <button onClick={() => navigate('/history/in')} className="text-xs font-bold text-purple-600 hover:underline tracking-widest uppercase">Lihat Semua</button>
                </div>
                <div className="p-4 space-y-2">
                  {(!recentActivities || recentActivities.length === 0) ? (
                    <p className="text-center py-8 text-gray-500 text-sm font-bold">Tidak ada aktivitas terbaru.</p>
                  ) : (
                    (recentActivities || []).slice(0, 8).map((act, i) => (
                      <RecentActivity
                        key={i}
                        title={act?.title}
                        time={moment(act?.created_at).fromNow()}
                        user={act?.user}
                        status={act?.status}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="text-lg font-black text-gray-800 dark:text-white tracking-tight mb-6">Aksi Cepat</h4>
                <div className="grid grid-cols-2 gap-4">
                  {(userRole === OTORITAS.SUPER_ADMIN || userRole === OTORITAS.ADMIN) && [
                    { icon: <HiPlus />, label: 'Barang', color: 'bg-blue-500', path: '/master/barang' },
                    { icon: <HiTrendingUp />, label: 'Masuk', color: 'bg-green-500', path: '/history/in' },
                    { icon: <HiTrendingDown />, label: 'Keluar', color: 'bg-red-500', path: '/history/out' },
                    { icon: <HiUsers />, label: 'Pegawai', color: 'bg-purple-500', path: '/master/pegawai' },
                  ].map((action, i) => (
                    <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group border border-transparent hover:border-purple-200 dark:hover:border-purple-800">
                      <div className={`${action.color} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>{action.icon}</div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{action.label}</span>
                    </button>
                  ))}

                  {(userRole === OTORITAS.STAF || userRole === OTORITAS.STAF_TATA_USAHA) && [
                    { icon: <HiSearch />, label: 'Cari Barang', color: 'bg-blue-500', path: '/record/barang' },
                    { icon: <HiPlus />, label: 'Permintaan', color: 'bg-purple-500', path: '/record/barang' },
                    { icon: <HiOutlineFolderOpen />, label: 'Aset Saya', color: 'bg-green-500', path: '/record/inventaris' },
                    { icon: <HiClipboardList />, label: 'History', color: 'bg-orange-500', path: '/history/out' },
                  ].map((action, i) => (
                    <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group border border-transparent hover:border-purple-200 dark:hover:border-purple-800">
                      <div className={`${action.color} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>{action.icon}</div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{action.label}</span>
                    </button>
                  ))}

                  {(userRole === OTORITAS.PETUGAS_PENGADAAN) && [
                    { icon: <HiTruck />, label: 'Barang Masuk', color: 'bg-green-500', path: '/history/in' },
                    { icon: <HiPlus />, label: 'Input Produk', color: 'bg-blue-500', path: '/master/barang' },
                    { icon: <HiUsers />, label: 'Supplier', color: 'bg-orange-500', path: '/master/supplier' },
                    { icon: <HiClipboardList />, label: 'Laporan', color: 'bg-purple-500', path: '/history/in' },
                  ].map((action, i) => (
                    <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group border border-transparent hover:border-purple-200 dark:hover:border-purple-800">
                      <div className={`${action.color} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>{action.icon}</div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{action.label}</span>
                    </button>
                  ))}

                  {(userRole === OTORITAS.KEPALA_BPS) && [
                    { icon: <HiChartBar />, label: 'Laporan Stok', color: 'bg-purple-500', path: '/record/barang' },
                    { icon: <HiClipboardList />, label: 'Audit Aset', color: 'bg-blue-500', path: '/record/inventaris' },
                    { icon: <HiTrendingUp />, label: 'Tren Masuk', color: 'bg-green-500', path: '/history/in' },
                    { icon: <HiTrendingDown />, label: 'Tren Keluar', color: 'bg-red-500', path: '/history/out' },
                  ].map((action, i) => (
                    <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group border border-transparent hover:border-purple-200 dark:hover:border-purple-800">
                      <div className={`${action.color} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>{action.icon}</div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HiExclamation className="w-16 h-16 text-red-600" />
                </div>
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
                  <HiExclamation className="w-6 h-6 animate-pulse" />
                  <h4 className="font-black text-sm uppercase tracking-wider">Alert Stok Menipis</h4>
                </div>
                <div className="space-y-3 relative z-10">
                  {(!stockAlerts || stockAlerts.length === 0) ? (
                    <p className="text-xs font-bold text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center">Semua stok aman!</p>
                  ) : (
                    (stockAlerts || []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-50 dark:border-red-900/20">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                          {item?.master_detail?.master_data?.nama_brg || 'Barang'}
                        </span>
                        <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-lg">Sisa {item?.stok}</span>
                      </div>
                    ))
                  )}
                  {stockAlerts && stockAlerts.length > 0 && (
                    <button onClick={() => navigate('/master/barang')} className="w-full mt-2 py-3 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-red-700 transition-all">Pesan Sekarang</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Transaction Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <h4 className="text-lg font-black text-gray-800 dark:text-white tracking-tight mb-8 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Tren Transaksi (7 Hari Terakhir)
              </h4>
              <div className="h-[300px]">
                <Line
                  data={lineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20, font: { weight: 'bold' } }
                      }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { display: false } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <h4 className="text-lg font-black text-gray-800 dark:text-white tracking-tight mb-8 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Distribusi Berdasarkan Kategori
              </h4>
              <div className="h-[300px] flex justify-center">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: { usePointStyle: true, padding: 20, font: { weight: 'bold' } }
                      }
                    },
                    cutout: '70%'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
