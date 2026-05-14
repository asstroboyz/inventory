import { useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiArrowUp, HiSearch, HiChevronLeft, HiChevronRight, HiCalendar, HiInformationCircle, HiUser, HiHashtag, HiClipboardList, HiChevronDown, HiChevronUp, HiViewGrid } from 'react-icons/hi'

const TransOut = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [expandedId, setExpandedId] = useState(null)
  const [totalItems, setTotalItems] = useState(0)

  const fetchData = useCallback(async (signal) => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/record/trans-out/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        signal,
        body: JSON.stringify({
          limit: itemsPerPage.toString(),
          page: currentPage.toString(),
          order: "id desc",
          search: searchTerm || null
        })
      })
      const result = await res.json()
      if (res.ok) {
        setData(result.data || [])
        setTotalItems(result.total || 0)
      } else {
        toast.error(result.message || 'Gagal mengambil data')
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      toast.error('Koneksi ke server terputus')
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm])

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  }, [fetchData])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <HiArrowUp className="text-red-600 w-6 h-6" />
              </div>
              Riwayat Barang Keluar
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-11 italic">Log riwayat pengeluaran atau mutasi barang keluar secara kolektif.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari... (Enter untuk mencari)"
              className="w-full pl-12 pr-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchTerm(searchQuery)
                  setCurrentPage(1)
                }
              }}
            />
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-[10px] font-bold tracking-widest text-left text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-6 py-5 text-center w-12"></th>
                  <th className="px-6 py-5 w-16 text-center">No</th>
                  <th className="px-6 py-5"><div className="flex items-center gap-2"><HiHashtag className="w-4 h-4 text-red-500" /> No. Referensi</div></th>
                  <th className="px-6 py-5"><div className="flex items-center gap-2"><HiCalendar className="w-4 h-4 text-red-500" /> Tanggal</div></th>
                  <th className="px-6 py-5"><div className="flex items-center gap-2"><HiInformationCircle className="w-4 h-4 text-red-500" /> Keterangan</div></th>
                  <th className="px-6 py-5"><div className="flex items-center gap-2"><HiUser className="w-4 h-4 text-red-500" /> Petugas</div></th>
                  <th className="px-6 py-5 text-right"><div className="flex items-center justify-end gap-2"><HiClipboardList className="w-4 h-4 text-red-500" /> Total Item</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500 animate-pulse font-medium">Memuat riwayat transaksi...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <HiSearch className="w-10 h-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Data tidak ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <Fragment key={row.ID || index}>
                      <tr
                        onClick={() => toggleExpand(row.ID)}
                        className={`text-gray-700 dark:text-gray-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors group cursor-pointer ${expandedId === row.ID ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                      >
                        <td className="px-6 py-4 text-center">
                          {expandedId === row.ID ? <HiChevronUp className="w-5 h-5 text-red-600 animate-bounce-subtle" /> : <HiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />}
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-mono">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold font-mono tracking-wider border border-amber-100 dark:border-amber-800">
                            {row.no_referensi}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                          {formatDate(row.tanggal || row.CreatedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col max-w-xs">
                            <span className="font-bold text-gray-800 dark:text-gray-200 truncate">{row.keterangan || 'Tanpa Keterangan'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px] font-bold text-red-600 overflow-hidden ring-2 ring-white dark:ring-gray-800">
                              {row.user?.berkas?.find(b => b.jenis === 'foto_profil') ? (
                                <img 
                                  src={`${BaseUrl}${row.user.berkas.find(b => b.jenis === 'foto_profil').path}`} 
                                  className="w-full h-full object-cover" 
                                  alt={row.user?.nama || row.user?.nama_depan} 
                                />
                              ) : (
                                <img 
                                  src={row.user?.jenis_kelamin === 'P' ? '/woman.png' : '/boy.png'} 
                                  className="w-full h-full object-cover" 
                                  alt="Avatar" 
                                />
                              )}
                            </div>
                            <span className="text-sm font-semibold">{row.user?.nama || (row.user?.nama_depan + ' ' + row.user?.nama_belakang) || 'System'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full font-bold text-xs">
                            {row.items?.length || 0} Barang
                          </span>
                        </td>
                      </tr>
                      {expandedId === row.ID && (
                        <tr>
                          <td colSpan="7" className="p-0 border-none">
                            <div className="px-12 py-6 bg-gray-50/50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-700 animate-slide-down">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-600">
                                  <HiViewGrid className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Detail Item Keluar</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(row.items || []).map((item, itIdx) => (
                                  <div key={item.ID || itIdx} className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono tracking-tighter uppercase mb-0.5">
                                          {item.barang?.master_barang?.kode_brg || 'BRG-000'}
                                        </span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                          {item.barang?.master_barang?.nama_brg || 'Nama Barang'}
                                        </span>
                                      </div>
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                        {item.barang?.satuan?.nama_satuan || 'Pcs'}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-3">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Jumlah</span>
                                        <span className="text-lg font-black text-red-600 dark:text-red-400">-{item.jumlah}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Sblm</span>
                                          <span className="text-sm font-bold text-gray-500">{item.stok_sebelum}</span>
                                        </div>
                                        <div className="h-8 w-px bg-gray-100 dark:bg-gray-700"></div>
                                        <div className="flex flex-col items-end">
                                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Ssdh</span>
                                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.stok_sesudah}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Halaman {currentPage} dari {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all shadow-sm"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all shadow-sm"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}} />
    </Layout>
  )
}

export default TransOut


