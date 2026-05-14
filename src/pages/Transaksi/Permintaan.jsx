import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiSearch, HiClipboardList, HiChevronLeft, HiChevronRight, HiX, HiEye, HiCheckCircle, HiClock, HiExclamationCircle, HiPlus, HiTrash, HiChevronDown } from 'react-icons/hi'
import { FaRegPlusSquare } from 'react-icons/fa'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'

/**
 * Premium Custom Table for Permintaan
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
  userAuthority
}) => {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/50">
              <th className="px-6 py-4 w-12"></th>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Kode Permintaan</th>
              <th className="px-6 py-4">Pemohon</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-gray-500">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center text-gray-500">Tidak ada data permintaan.</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <React.Fragment key={row.ID || index}>
                  <tr className={`text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer ${expandedId === row.ID ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`} onClick={() => toggleExpand(row.ID)}>
                    <td className="px-6 py-4 text-center">
                      <div className={`transition-transform duration-300 ${expandedId === row.ID ? 'rotate-180' : ''}`}>
                        <HiChevronDown className="w-5 h-5 text-purple-600" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{row.permintaan_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
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
                    <td className="px-6 py-4 text-sm font-semibold">
                      {row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        row.status?.toLowerCase() === 'approved' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                        row.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' :
                        'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => onDetail(row)} className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-all">
                          <HiEye className="w-5 h-5" />
                        </button>
                        {row.status === 'Pending' && UserHelper.isApprover() && (
                          <>
                            <button onClick={() => onUpdateStatus(row, 'Approved')} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all">
                              <HiCheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => onUpdateStatus(row, 'Rejected')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
                              <HiExclamationCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Section */}
                  {expandedId === row.ID && (
                    <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                      <td colSpan="7" className="px-8 py-6">
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-8 bg-purple-600 rounded-full"></div>
                            <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detail Item Barang</h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {row.details?.map((det, i) => (
                              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{det.barang_r?.master_barang?.nama_brg || 'Unknown Item'}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${det.status === 'Approved' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                                      {det.status}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-mono mb-3">{det.barang_r?.master_barang?.kode_brg || '-'}</p>
                                  <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl mb-3">
                                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase mb-1">Keperluan</p>
                                    <p className="text-xs italic text-gray-600 dark:text-gray-400 line-clamp-2">{det.keperluan || 'Tidak ada catatan.'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between border-t dark:border-gray-700 pt-3 mt-auto">
                                  <span className="text-[10px] text-gray-500 uppercase font-black">Jumlah</span>
                                  <span className="text-sm font-black text-purple-600 dark:text-purple-400">{det.jumlah} <span className="text-[10px]">UNIT</span></span>
                                </div>
                              </div>
                            ))}
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

function Permintaan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  // User data and authority helpers are now centralized in UserHelper

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    details: [
      { barang_r_id: '', barang_label: '', jumlah: 1, keperluan: '' }
    ]
  })

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [expandedId, setExpandedId] = useState(null)
  const [totalItems, setTotalItems] = useState(0)


  const fetchData = async () => {
    setLoading(true)
    try {
      const payload = {
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        order: "id desc",
        search: searchTerm || null
      }

      if (UserHelper.isStaff()) {
        payload.user_id = UserHelper.getUserId()
      }

      const res = await fetch(`${BaseUrl}/api/transaction/permintaan/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        setData(result.data || [])
        setTotalItems(result.total || 0)
      } else {
        toast.error(result.message || 'Gagal mengambil data')
      }
    } catch (err) {
      toast.error('Koneksi ke server terputus')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, itemsPerPage, searchTerm])

  const loadBarang = async (inputValue) => {
    try {
      const res = await fetch(`${BaseUrl}/api/record/barang/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1" })
      })
      const result = await res.json()
      if (res.ok) {
        // Filter out items already selected in formData.details
        const selectedIds = formData.details.map(d => d.barang_r_id).filter(id => id);
        return (result.data || [])
          .filter(item => !selectedIds.includes(item.ID))
          .map(i => ({
            label: `${i.master_barang?.nama_brg} (${i.satuan?.nama_satuan}) - Stok: ${i.stok}`,
            value: i.ID
          }))
      }
      return []
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { barang_r_id: '', barang_label: '', jumlah: 1, keperluan: '' }]
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validasi
    if (formData.details.some(d => !d.barang_r_id)) {
      return toast.error("Pilih barang untuk semua baris!")
    }

    try {
      const res = await fetch(`${BaseUrl}/api/transaction/permintaan/`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Permintaan berhasil dibuat!')
        setIsCreateModalOpen(false)
        setFormData({
          tanggal: new Date().toISOString().split('T')[0],
          keterangan: '',
          details: [{ barang_r_id: '', barang_label: '', jumlah: 1, keperluan: '' }]
        })
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal menyimpan')
      }
    } catch { toast.error('Kesalahan sistem') }
  }




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

      const res = await fetch(`${BaseUrl}/api/transaction/permintaan/${item.ID}/status`, {
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

  const totalPages = Math.ceil(totalItems / itemsPerPage)


  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiClipboardList className="text-purple-600 w-6 h-6" />
              </div>
              Transaksi Permintaan
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-11">Kelola permohonan permintaan barang habis pakai.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari... (Enter)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all shadow-sm"
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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-2xl shadow-lg hover:bg-purple-700 transition-all"
            >
              <HiPlus className="w-5 h-5" />
              <span>Buat Permintaan</span>
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
        />

        {/* Modal Detail */}
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    Detail Permintaan <span className="text-purple-600 font-mono">{selectedItem.permintaan_code}</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daftar item barang yang diminta oleh pegawai.</p>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>

              <div className="p-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Pemohon</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                        {selectedItem.user?.berkas?.find(b => b.jenis === 'foto_profil') ? (
                          <img
                            src={`${BaseUrl}${selectedItem.user.berkas.find(b => b.jenis === 'foto_profil').path}`}
                            className="w-full h-full object-cover"
                            alt={selectedItem.user?.nickname}
                          />
                        ) : (
                          <img
                            src={selectedItem.user?.jenis_kelamin === 'P' ? '/woman.png' : '/boy.png'}
                            className="w-full h-full object-cover"
                            alt="Avatar"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedItem.user?.nama_lengkap || selectedItem.user?.username}</p>
                        <p className="text-xs text-gray-500">{selectedItem.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Status Permintaan</p>
                    <div className="flex items-center gap-2">
                      {selectedItem.status === 'Approved' ? <HiCheckCircle className="text-green-500 w-5 h-5" /> : selectedItem.status === 'Rejected' ? <HiExclamationCircle className="text-red-500 w-5 h-5" /> : <HiClock className="text-orange-500 w-5 h-5" />}
                      <span className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{selectedItem.status}</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-black">
                      <tr>
                        <th className="px-6 py-3">Barang</th>
                        <th className="px-6 py-3 text-center">Jumlah Diminta</th>
                        <th className="px-6 py-3">Keperluan</th>
                        <th className="px-6 py-3 text-right">Status Item</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {selectedItem.details?.map((det, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 dark:text-gray-200">{det.barang_r?.master_barang?.nama_brg || 'Unknown Item'}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{det.barang_r?.master_barang?.kode_brg || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-base">{det.jumlah}</span>
                            <span className="text-[10px] ml-1 text-gray-500 uppercase">Item</span>
                          </td>
                          <td className="px-6 py-4 text-xs italic text-gray-600 dark:text-gray-400 max-w-xs">
                            {det.keperluan || '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${det.status?.toLowerCase() === 'approved' ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' :
                              det.status?.toLowerCase() === 'rejected' ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' :
                                'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                              }`}>
                              {det.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
              <header className="px-8 py-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Buat Permintaan Barang</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500"><HiX className="w-6 h-6" /></button>
              </header>

              <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                <div className="p-8 overflow-y-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <label className="block text-sm">
                      <span className="font-bold text-[10px] uppercase text-gray-500">Tanggal</span>
                      <input
                        type="date"
                        required
                        className="form-input mt-2"
                        value={formData.tanggal}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="font-bold text-[10px] uppercase text-gray-500">Keterangan Umum</span>
                      <input
                        className="form-input mt-2"
                        placeholder="Contoh: Kebutuhan kantor bulan Mei"
                        value={formData.keterangan}
                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase text-gray-500 tracking-wider">Item Barang</h4>
                      <button
                        type="button"
                        onClick={handleAddDetail}
                        className="p-1.5 text-purple-600 hover:text-purple-700 transition-all flex items-center justify-center rounded-lg hover:bg-purple-50"
                        title="Tambah Item"
                      >
                        <FaRegPlusSquare className="w-7 h-7" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-[10px] font-black uppercase text-gray-400">
                          <tr>
                            <th className="px-4 py-3 text-left w-1/3">Cari Barang</th>
                            <th className="px-4 py-3 text-center w-24">Jumlah</th>
                            <th className="px-4 py-3 text-left">Keperluan / Catatan</th>
                            <th className="px-4 py-3 text-center w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                          {formData.details.map((detail, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={loadBarang}
                                  placeholder="Ketik nama barang..."
                                  className="text-xs"
                                  classNamePrefix="select"
                                  menuPortalTarget={document.body}
                                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                  value={detail.barang_r_id ? { label: detail.barang_label, value: detail.barang_r_id } : null}
                                  onChange={(opt) => {
                                    if (!opt) return;
                                    // Double check for duplicates
                                    const isExist = formData.details.some((d, i) => i !== index && d.barang_r_id === opt.value);
                                    if (isExist) {
                                      toast.error("Barang ini sudah ada di daftar!");
                                      return;
                                    }

                                    const newDetails = [...formData.details]
                                    newDetails[index].barang_r_id = opt?.value
                                    newDetails[index].barang_label = opt?.label
                                    setFormData({ ...formData, details: newDetails })
                                  }}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="1"
                                  required
                                  className="form-input text-center font-mono"
                                  value={detail.jumlah}
                                  onChange={(e) => handleDetailChange(index, 'jumlah', parseInt(e.target.value))}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  className="form-input"
                                  placeholder="Contoh: Untuk staf baru"
                                  value={detail.keperluan}
                                  onChange={(e) => handleDetailChange(index, 'keperluan', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDetail(index)}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  disabled={formData.details.length === 1}
                                >
                                  <HiTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-500">Batal</button>
                  <button type="submit" className="px-10 py-2 text-sm font-bold text-white bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700">Simpan Permintaan</button>
                </footer>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Permintaan
