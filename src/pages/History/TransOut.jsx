import { useState, useEffect, useCallback, useMemo } from 'react'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiArrowUp, HiSearch, HiChevronLeft, HiChevronRight, HiCalendar, HiInformationCircle } from 'react-icons/hi'

const TransOut = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/record/trans-out/`, {
        headers: UserHelper.authHeader()
      })
      const result = await res.json()
      if (res.ok) {
        setData(result.data || [])
      } else {
        toast.error(result.message || 'Gagal mengambil data')
      }
    } catch {
      toast.error('Koneksi ke server terputus')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredData = useMemo(() => {
    return data.filter(item =>
      (item.informasi_tambahan || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <HiArrowUp className="text-red-600 w-6 h-6" />
              </div>
              History Trans Out
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-11 italic">Log riwayat pengeluaran atau mutasi barang keluar.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari keterangan..."
              className="w-full pl-12 pr-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-3xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-6 py-5 text-center w-16">No</th>
                  <th className="px-6 py-5"><div className="flex items-center gap-2"><HiCalendar className="w-4 h-4" /> Tanggal</div></th>
                  <th className="px-6 py-5"><div className="flex items-center gap-2"><HiInformationCircle className="w-4 h-4" /> Keterangan</div></th>
                  <th className="px-6 py-5 text-right">Jumlah Keluar</th>
                  <th className="px-6 py-5 text-right">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500 animate-pulse">Menghubungkan ke server...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <HiSearch className="w-12 h-12 text-gray-300" />
                        <span className="text-sm font-medium text-gray-500">Data tidak ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => (
                    <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors group">
                      <td className="px-6 py-4 text-sm text-center font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {row.tanggal_barang_keluar || row.CreatedAt?.split('T')[0]}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 dark:text-gray-200">{row.informasi_tambahan || 'Pengeluaran Barang'}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase">REF-LOG-{row.ID}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-red-600 dark:text-red-400">
                        <span className="bg-red-100 dark:bg-red-900/40 px-3 py-1 rounded-lg">-{row.jumlah_perubahan}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-gray-100 font-mono">
                        {row.stok}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase">Halaman {currentPage} dari {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default TransOut
