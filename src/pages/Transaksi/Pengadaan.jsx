import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiTrash, HiSearch, HiShoppingCart, HiChevronLeft, HiChevronRight, HiX, HiEye, HiCheckCircle, HiClock, HiClipboardList, HiPlus, HiChevronDown } from 'react-icons/hi'
import { FaRegPlusSquare, FaSpinner } from 'react-icons/fa'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'

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
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/50">
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Kode Transaksi</th>
              <th className="px-6 py-4">Penanggung Jawab</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Tanggal Transaksi</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FaSpinner className="w-10 h-10 text-purple-600 animate-spin" />
                    <span className="text-sm font-semibold text-gray-500">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                  Tidak ada data pengadaan.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <React.Fragment key={row.ID || index}>
                  <tr
                    onClick={() => toggleRow(row.ID)}
                    className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm flex items-center gap-2">
                      <HiChevronRight className={`w-4 h-4 transition-transform ${expandedRows.has(row.ID) ? 'rotate-90' : ''}`} />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{row.pengadaan_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-xs overflow-hidden ring-2 ring-white dark:ring-gray-800">
                          {row.user?.berkas?.find(b => b.jenis === 'foto_profil') ? (
                            <img
                              src={`${BaseUrl}${row.user.berkas.find(b => b.jenis === 'foto_profil').path}`}
                              className="w-full h-full object-cover"
                              alt={row.user?.nickname}
                            />
                          ) : (
                            <img
                              src={row.user?.jenis_kelamin === 'P' ? '/woman.png' : '/boy.png'}
                              className="w-full h-full object-cover"
                              alt="Avatar"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 dark:text-gray-200">{row.user?.nama_lengkap || row.user?.username || '-'}</span>
                          <span className="text-[10px] text-gray-500">{row.user?.email || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 dark:text-gray-200">{row.supplier?.nama_supplier || '-'}</span>
                        <span className="text-[10px] text-gray-500">{row.supplier?.pic || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 w-fit ${row.status?.toLowerCase() === 'completed' || row.status?.toLowerCase() === 'approved'
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                          : row.status?.toLowerCase() === 'rejected' || row.status?.toLowerCase() === 'cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${row.status?.toLowerCase() === 'completed' || row.status?.toLowerCase() === 'approved' ? 'bg-green-500' : row.status?.toLowerCase() === 'rejected' || row.status?.toLowerCase() === 'cancelled' ? 'bg-red-500' : 'bg-orange-500'}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDetail(row); }}
                          className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-all"
                        >
                          <HiEye className="w-5 h-5" />
                        </button>
                        {row.status?.toLowerCase() !== 'completed' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(row, 'Completed'); }}
                            className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
                          >
                            <HiCheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(row.ID || row.id); }}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Content */}
                  {expandedRows.has(row.ID) && (
                    <tr className="bg-gray-50/50 dark:bg-gray-900/20 animate-in slide-in-from-top-1 duration-200">
                      <td colSpan="7" className="px-10 py-6 border-l-4 border-purple-500">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                            <HiShoppingCart className="w-4 h-4" />
                            Daftar Item Pengadaan
                          </h4>
                          <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 font-bold uppercase tracking-wider">
                                <tr>
                                  <th className="px-6 py-3">Item Barang</th>
                                  <th className="px-6 py-3">Spesifikasi</th>
                                  <th className="px-6 py-3 text-center">Jumlah</th>
                                  <th className="px-6 py-3 text-right">Harga Est.</th>
                                  <th className="px-6 py-3 text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y dark:divide-gray-700">
                                {row.details?.map((det, i) => (
                                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-[9px] text-purple-600 dark:text-purple-400 font-mono font-bold border border-purple-200/50 dark:border-purple-800/50">
                                          {det.inventaris?.master_barang?.kode_brg || '-'}
                                        </span>
                                        <span className="text-gray-400 font-bold">•</span>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{det.nama_barang || '-'}</p>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">{det.spesifikasi || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-700 dark:text-gray-300">{det.jumlah}</td>
                                    <td className="px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-400">Rp {new Intl.NumberFormat('id-ID').format(det.harga_estimasi || 0)}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-purple-600 dark:text-purple-400">Rp {new Intl.NumberFormat('id-ID').format((det.jumlah || 0) * (det.harga_estimasi || 0))}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    supplier_id: '',
    supplier_label: '',
    keterangan: '',
    details: [
      { inventaris_id: '', nama_barang: '', barang_label: '', spesifikasi: '', jumlah: 1, harga_estimasi: 0 }
    ]
  })



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

  const handleUpdateStatus = async (item, status) => {
    const { value: note, isConfirmed } = await Swal.fire({
      title: `Konfirmasi ${status}`,
      text: `Berikan catatan untuk status ${status}:`,
      input: 'textarea',
      inputPlaceholder: 'Tulis catatan di sini...',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#9333ea', // Purple-600
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      inputAttributes: {
        autocapitalize: 'off'
      },
      preConfirm: (value) => {
        if (!value && status === 'Rejected') {
          Swal.showValidationMessage('Catatan wajib diisi jika menolak!')
        }
        return value || "-"
      }
    })

    if (!isConfirmed) return;

    try {
      const payload = {
        details: item.details?.map(d => ({ id: d.ID, status: status.toLowerCase() })),
        note
      }

      const res = await fetch(`${BaseUrl}/api/transaction/pengadaan/${item.ID}/status`, {
        method: 'PUT',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify(payload)
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

  const loadSuppliers = async (inputValue) => {
    try {
      const res = await fetch(`${BaseUrl}/api/master/supplier/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1" })
      })
      const result = await res.json()
      if (res.ok) {
        return (result.data || []).map(s => ({ value: s.ID, label: s.nama_supplier }))
      }
      return []
    } catch { return [] }
  }

  const loadInventaris = async (inputValue) => {
    try {
      const res = await fetch(`${BaseUrl}/api/record/inventaris/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1" })
      })
      const result = await res.json()
      if (res.ok) {
        // Filter out items already in details
        const selectedIds = formData.details.map(d => d.inventaris_id)
        return (result.data || [])
          .filter(b => !selectedIds.includes(b.ID))
          .map(b => ({
            value: b.ID,
            label: `${b.master_barang?.nama_brg} (${b.master_barang?.kode_brg})`,
            nama_asli: b.master_barang?.nama_brg
          }))
      }
      return []
    } catch { return [] }
  }

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { inventaris_id: '', nama_barang: '', barang_label: '', spesifikasi: '', jumlah: 1, harga_estimasi: 0 }]
    })
  }

  const handleRemoveDetail = (index) => {
    if (formData.details.length === 1) return
    const newDetails = [...formData.details]
    newDetails.splice(index, 1)
    setFormData({ ...formData, details: newDetails })
  }

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.details]
    newDetails[index][field] = value
    setFormData({ ...formData, details: newDetails })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.supplier_id) return toast.error('Pilih supplier terlebih dahulu')

    try {
      const res = await fetch(`${BaseUrl}/api/transaction/pengadaan/`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({
          ...formData,
          tanggal: new Date(formData.tanggal).toISOString(),
          details: formData.details.map(d => ({
            ...d,
            jumlah: parseInt(d.jumlah),
            harga_estimasi: parseFloat(d.harga_estimasi)
          }))
        })
      })

      if (res.ok) {
        toast.success('Transaksi pengadaan berhasil disimpan!')
        setIsCreateModalOpen(false)
        setFormData({
          tanggal: new Date().toISOString().split('T')[0],
          supplier_id: '',
          supplier_label: '',
          keterangan: '',
          details: [{ inventaris_id: '', nama_barang: '', barang_label: '', spesifikasi: '', jumlah: 1, harga_estimasi: 0 }]
        })
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal menyimpan')
      }
    } catch { toast.error('Kesalahan sistem') }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const selectStyles = {
    control: (base) => ({
      ...base,
      background: document.documentElement.classList.contains('dark') ? '#111827' : '#f9fafb',
      borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
      borderRadius: '0.75rem',
      padding: '2px',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9333ea'
      }
    }),
    menu: (base) => ({
      ...base,
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      borderRadius: '1rem',
      overflow: 'hidden',
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused
        ? (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6')
        : 'transparent',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      cursor: 'pointer'
    }),
    singleValue: (base) => ({
      ...base,
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
    }),
    input: (base) => ({
      ...base,
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    })
  }

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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-11">Monitor dan kelola pengadaan barang dari supplier.</p>
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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none active:scale-95 transition-all"
            >
              <HiPlus className="w-5 h-5" />
              <span>Tambah Transaksi</span>
            </button>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daftar item barang yang diadakan dalam transaksi ini.</p>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>

              <div className="p-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1.5">
                      <HiShoppingCart className="w-3 h-3" /> Supplier
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedItem.supplier?.nama_supplier || '-'}</p>
                    <p className="text-xs text-gray-500">{selectedItem.supplier?.email || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1.5">
                      <HiClipboardList className="w-3 h-3" /> Penanggung Jawab
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedItem.user?.nama_lengkap || selectedItem.user?.username || 'System'}</p>
                    <p className="text-xs text-gray-500">{selectedItem.user?.email || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1.5">
                      <HiClock className="w-3 h-3" /> Status Transaksi
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${['approved', 'completed', 'success'].includes(selectedItem.status?.toLowerCase())
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                          : ['rejected', 'cancelled', 'failed'].includes(selectedItem.status?.toLowerCase())
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${['approved', 'completed', 'success'].includes(selectedItem.status?.toLowerCase()) ? 'bg-green-500' : ['rejected', 'cancelled', 'failed'].includes(selectedItem.status?.toLowerCase()) ? 'bg-red-500' : 'bg-orange-500'}`} />
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-black">
                      <tr>
                        <th className="px-6 py-3">Item Barang</th>
                        <th className="px-6 py-3">Spesifikasi</th>
                        <th className="px-6 py-3 text-center">Jumlah</th>
                        <th className="px-6 py-3 text-right">Harga Satuan</th>
                        <th className="px-6 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {selectedItem.details?.map((det, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-[9px] text-purple-600 dark:text-purple-400 font-mono font-bold border border-purple-200/50 dark:border-purple-800/50">
                                {det.inventaris?.master_barang?.kode_brg || '-'}
                              </span>
                              <span className="text-gray-400 font-bold">-</span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">{det.nama_barang || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">{det.spesifikasi || '-'}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-mono font-bold">{det.jumlah}</span>
                            <span className="text-[10px] ml-1 text-gray-500 uppercase">{det.satuan || 'UNIT'}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono">
                            Rp {new Intl.NumberFormat('id-ID').format(det.harga_estimasi || 0)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                            Rp {new Intl.NumberFormat('id-ID').format((det.jumlah || 0) * (det.harga_estimasi || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-900/50 font-bold">
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-right uppercase text-[10px]">Total Pengadaan</td>
                        <td className="px-6 py-4 text-right text-lg text-purple-600 dark:text-purple-400">
                          Rp {new Intl.NumberFormat('id-ID').format(selectedItem.details?.reduce((acc, curr) => acc + (curr.jumlah * curr.harga_estimasi), 0) || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Riwayat Approval */}
                {selectedItem.approvals?.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="text-sm font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2">
                      <HiClipboardList className="w-4 h-4" />
                      Riwayat Approval
                    </h4>
                    <div className="space-y-3">
                      {selectedItem.approvals.map((app, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                          <div className={`w-2 self-stretch rounded-full ${['approved', 'completed'].includes(app.action?.toLowerCase()) ? 'bg-green-500' :
                              ['rejected', 'cancelled'].includes(app.action?.toLowerCase()) ? 'bg-red-500' :
                                'bg-orange-500'
                            }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{app.user?.nama_lengkap || app.user?.username || 'Unknown User'}</span>
                              <span className="text-[10px] text-gray-400 font-mono italic">{new Date(app.CreatedAt).toLocaleString('id-ID')}</span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">{app.action}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{app.note || 'Tidak ada catatan'}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end border-t dark:border-gray-700">
                <button onClick={() => setIsDetailModalOpen(false)} className="px-8 py-2 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg active:scale-95 transition-all">
                  Tutup Detail
                </button>
              </footer>
            </div>
          </div>
        )}
        {/* Modal Create */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    Buat Transaksi Pengadaan Baru
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Isi formulir di bawah untuk mencatat pengadaan barang baru.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>

              <form onSubmit={handleSave} className="p-8 overflow-y-auto no-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Supplier</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadSuppliers}
                      styles={selectStyles}
                      onChange={(opt) => setFormData({ ...formData, supplier_id: opt.value, supplier_label: opt.label })}
                      placeholder="Cari Supplier..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Tanggal Transaksi</label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 transition-all dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2">
                      <FaRegPlusSquare className="w-4 h-4" />
                      Detail Item Pengadaan
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddDetail}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <HiPlus className="w-3 h-3" /> Tambah Baris
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.details.map((item, index) => (
                      <div key={index} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cari Inventaris</label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadInventaris}
                            styles={selectStyles}
                            onChange={(opt) => {
                              if (!opt) return
                              handleDetailChange(index, 'inventaris_id', opt.value)
                              handleDetailChange(index, 'nama_barang', opt.nama_asli)
                              handleDetailChange(index, 'barang_label', opt.label)
                            }}
                            value={item.inventaris_id ? { value: item.inventaris_id, label: item.barang_label } : null}
                            placeholder="Pilih barang..."
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Spesifikasi</label>
                          <input
                            type="text"
                            placeholder="Warna, Ukuran, dll..."
                            className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                            value={item.spesifikasi}
                            onChange={(e) => handleDetailChange(index, 'spesifikasi', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Jumlah</label>
                          <input
                            type="number"
                            required
                            min="1"
                            className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                            value={item.jumlah}
                            onChange={(e) => handleDetailChange(index, 'jumlah', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Harga Est.</label>
                          <input
                            type="number"
                            required
                            min="0"
                            className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 font-mono"
                            value={item.harga_estimasi}
                            onChange={(e) => handleDetailChange(index, 'harga_estimasi', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end pb-1 justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveDetail(index)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Keterangan Tambahan</label>
                  <textarea
                    placeholder="Opsional: Tambahkan info pengadaan..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 transition-all dark:text-gray-200 min-h-[100px]"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  ></textarea>
                </div>
              </form>

              <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  onClick={handleSave}
                  className="px-10 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-2xl hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none active:scale-95 transition-all"
                >
                  Simpan Transaksi
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
