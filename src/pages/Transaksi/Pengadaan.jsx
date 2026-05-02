import { useState, useEffect, useCallback } from 'react'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiTrash, HiSearch, HiShoppingCart, HiChevronLeft, HiChevronRight, HiX, HiEye, HiCheckCircle, HiClock } from 'react-icons/hi'

/**
 * Premium Custom Table for Pengadaan
 */
const CustomPremiumTable = ({ 
  loading, 
  data, 
  currentPage, 
  itemsPerPage, 
  totalPages, 
  setCurrentPage, 
  onDetail,
  onUpdateStatus,
  onDelete 
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/50">
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Kode Transaksi</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Tanggal / Periode</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-gray-500">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-gray-500">
                  Tidak ada data pengadaan.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (

                <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{row.pengadaan_code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{row.supplier?.nama_supplier || '-'}</span>
                      <span className="text-[10px] text-gray-500">{row.supplier?.pic || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{row.tanggal}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-black">Periode {row.tahun_periode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      row.status === 'Completed' 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' 
                      : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => onDetail(row)} className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-all">
                        <HiEye className="w-5 h-5" />
                      </button>
                      {row.status !== 'Completed' && (
                        <button onClick={() => onUpdateStatus(row.ID || row.id, 'Completed')} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all">
                          <HiCheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => onDelete(row.ID || row.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
         <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Halaman {currentPage} dari {totalPages || 1}
         </span>
         <div className="flex items-center gap-2">
            <button 
               disabled={currentPage === 1}
               onClick={() => setCurrentPage(prev => prev - 1)}
               className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
            >
               <HiChevronLeft className="w-5 h-5" />
            </button>
            <button 
               disabled={currentPage === totalPages || totalPages === 0}
               onClick={() => setCurrentPage(prev => prev + 1)}
               className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
            >
               <HiChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  )
}

function Pengadaan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")



  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/transaction/pengadaan/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({
          limit: itemsPerPage.toString(),
          page: currentPage.toString(),
          order: order,
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
    } catch {
      toast.error('Koneksi ke server terputus')
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm, order])



  useEffect(() => {
    Promise.resolve().then(() => fetchData())
  }, [fetchData])

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Selesaikan pengadaan ini?`)) return
    try {
      const res = await fetch(`${BaseUrl}/api/transaction/pengadaan/${id}/status`, {
        method: 'PATCH',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        toast.success('Status berhasil diperbarui!')
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal update status')
      }
    } catch {
      toast.error('Kesalahan koneksi')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus data pengadaan ini?')) return
    toast.error('Fitur hapus transaksi dinonaktifkan untuk menjaga integritas data.')
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)


  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiShoppingCart className="text-purple-600 w-6 h-6" />
              </div>
              Transaksi Pengadaan
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Monitor dan kelola pengadaan barang dari supplier.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            {/* 
            Tombol tambah transaksi bisa diarahkan ke halaman form khusus atau modal kompleks.
            Untuk sekarang kita fokus ke monitoring.
            */}
          </div>
        </div>

        <CustomPremiumTable 
          loading={loading}
          data={data}

          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onDetail={(item) => { setSelectedItem(item); setIsDetailModalOpen(true); }}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />

        {/* Modal Detail */}
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    Detail Pengadaan <span className="text-purple-600 font-mono">{selectedItem.pengadaan_code}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Daftar item barang yang diadakan dalam transaksi ini.</p>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>
              
              <div className="p-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Supplier</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedItem.supplier?.nama_supplier}</p>
                    <p className="text-xs text-gray-500">{selectedItem.supplier?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Penanggung Jawab</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedItem.user?.nickname || 'System'}</p>
                    <p className="text-xs text-gray-500">{selectedItem.user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Status Transaksi</p>
                    <div className="flex items-center gap-2">
                      {selectedItem.status === 'Completed' ? <HiCheckCircle className="text-green-500 w-5 h-5" /> : <HiClock className="text-orange-500 w-5 h-5" />}
                      <span className="text-sm font-bold uppercase">{selectedItem.status}</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-black">
                      <tr>
                        <th className="px-6 py-3">Item Barang</th>
                        <th className="px-6 py-3 text-center">Jumlah</th>
                        <th className="px-6 py-3 text-right">Harga Satuan</th>
                        <th className="px-6 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {selectedItem.details?.map((det, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 dark:text-gray-200">{det.nama_barang_input || '-'}</span>
                              <span className="text-[10px] text-gray-400">{det.spesifikasi || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-mono font-bold">{det.jumlah}</span>
                            <span className="text-[10px] ml-1 text-gray-500 uppercase">{det.satuan || 'UNIT'}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono">
                            Rp {new Intl.NumberFormat('id-ID').format(det.harga_satuan || 0)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                            Rp {new Intl.NumberFormat('id-ID').format((det.jumlah || 0) * (det.harga_satuan || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-900/50 font-bold">
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-right uppercase text-[10px]">Total Pengadaan</td>
                        <td className="px-6 py-4 text-right text-lg text-purple-600 dark:text-purple-400">
                          Rp {new Intl.NumberFormat('id-ID').format(selectedItem.details?.reduce((acc, curr) => acc + (curr.jumlah * curr.harga_satuan), 0) || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end border-t dark:border-gray-700">
                <button onClick={() => setIsDetailModalOpen(false)} className="px-8 py-2 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg active:scale-95 transition-all">
                  Tutup Detail
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Pengadaan
