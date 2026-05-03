import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import {
  HiSearch,
  HiUserGroup,
  HiIdentification,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiX,
  HiDownload,
  HiLockClosed,
  HiLockOpen,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi'
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb'
import Select from 'react-select'
import { OTORITAS, getOtoritasName } from '../../constants/otoritas'

/**
 * Returns a default avatar path based on jenis_kelamin.
 */
const getDefaultAvatar = (user) => {
  return user.jenis_kelamin === 'P' ? '/woman.png' : '/boy.png'
}


/**
 * Premium Custom Table Component
 * Designed to provide a high-end UI/UX while remaining stable in React 19
 */
const CustomPremiumTable = ({
  loading,
  data,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  onDetail,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/50">
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Pegawai</th>
              <th className="px-6 py-4">Kontak</th>
              <th className="px-6 py-4">Role</th>
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
                <td colSpan="6" className="px-6 py-20 text-center text-gray-500 font-medium">
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-10 h-10 mr-3 rounded-full md:block overflow-hidden border-2 border-purple-500/30 shadow-sm flex-shrink-0 group-hover:border-purple-500 transition-colors">
                        {row.berkas?.find(b => b.jenis === 'foto_profil') ? (
                          <img className="object-cover w-full h-full" src={`${BaseUrl}${row.berkas.find(b => b.jenis === 'foto_profil').path}`} alt="" loading="lazy" />
                        ) : (
                          <img className="object-cover w-full h-full" src={getDefaultAvatar(row)} alt="" loading="lazy" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{row.nickname}</p>
                          {row.jenis_kelamin === 'L' ? <TbGenderMale className="text-blue-500 w-4 h-4" title="Laki-laki" /> : <TbGenderFemale className="text-pink-500 w-4 h-4" title="Perempuan" />}
                        </div>
                        <p className="text-[10px] text-gray-500">{row.first_name} {row.last_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{row.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500 font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">{row.bagian?.nama || '-'}</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">{row.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {row.otoritas ? (
                        <span className="px-2 py-1 font-bold leading-tight text-blue-700 bg-blue-50 border border-blue-100 rounded-lg dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                          {row.otoritas.nama}
                        </span>
                      ) : (
                        <span className="px-2 py-1 font-bold leading-tight text-gray-400 bg-gray-50 border border-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700">
                          No Role
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2 py-1 font-black uppercase rounded-lg border ${row.status === 'active'
                      ? 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                      : 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                      }`}>
                      {row.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => onDetail(row)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all">
                        <HiEye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onToggleStatus(row)} className={`p-2 rounded-lg transition-all ${row.status === 'active' ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30'}`}>
                        {row.status === 'active' ? <HiLockClosed className="w-4 h-4" /> : <HiLockOpen className="w-4 h-4" />}
                      </button>
                      <button onClick={() => onEdit(row)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(row.ID || row.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
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
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
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

function Pegawai() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")
  const [config] = useState(() => UserHelper.axiosConfig())

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedPegawai, setSelectedPegawai] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [bagianOptions, setBagianOptions] = useState([])

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      nickname: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      status: 'active',
      otoritas_id: '',
      bagian_id: '',
      jenis_kelamin: 'L',
      tanggal_lahir: ''
    }
  })

  // --- Data Fetching ---
  const fetchData = useCallback(async (searchVal = searchTerm) => {
    if (!config) return
    setLoading(true)
    try {
      const { data } = await axios.post(`${BaseUrl}/api/user/cari`, {
        "Search": searchVal || null,
        "Limit": String(itemsPerPage),
        "Page": String(currentPage),
        "Order": order
      }, config)

      setData(data.data || [])
      setTotalItems(data.total || 0)
    } catch (error) {
      console.error(error)
      toast.error('Gagal mengambil data pegawai')
    } finally {
      setLoading(false)
    }
  }, [config, itemsPerPage, currentPage, order])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchTerm)
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, fetchData])

  // Fetch Bagian Options
  useEffect(() => {
    const fetchBagian = async () => {
      try {
        const { data } = await axios.get(`${BaseUrl}/api/bagian/`, config)
        if (data.data) {
          const options = data.data.map(item => ({
            value: item.id || item.ID,
            label: item.nama || item.Nama
          }))
          setBagianOptions(options)
        }
      } catch (error) {
        console.error("Gagal mengambil data bagian", error)
      }
    }
    if (config) fetchBagian()
  }, [config])

  const openFormModal = (item = null) => {
    if (item) {
      setEditingId(item.ID || item.id)
      reset({
        nickname: item.nickname || '',
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        email: item.email || '',
        phone: item.phone || '',
        status: item.status || 'active',
        otoritas_id: item.otoritas_id || '',
        bagian_id: item.bagian_id || '',
        jenis_kelamin: item.jenis_kelamin || 'L',
        tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : ''
      })
    } else {
      setEditingId(null)
      reset({
        nickname: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'active',
        otoritas_id: '',
        bagian_id: '',
        jenis_kelamin: 'L',
        tanggal_lahir: ''
      })
    }
    setIsFormModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setEditingId(null)
    reset({
      nickname: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      status: 'active',
      otoritas_id: '',
      bagian_id: '',
      jenis_kelamin: 'L',
      tanggal_lahir: ''
    })
  }

  const insertData = async (formData) => {
    try {
      const res = await axios.post(`${BaseUrl}/api/user/`, formData, config)
      if (res.status === 200 || res.status === 201) {
        toast.success('Pegawai baru terdaftar!')
        closeFormModal()
        fetchData()
      } else {
        toast.error(res.data?.message || 'Gagal menambahkan pegawai')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Terjadi kesalahan sistem saat menambah')
    }
  }

  const updateData = async (formData) => {
    try {
      const res = await axios.put(`${BaseUrl}/api/user/${editingId}`, formData, config)
      if (res.status === 200 || res.status === 201) {
        toast.success('Data pegawai diperbarui!')
        closeFormModal()
        fetchData()
      } else {
        toast.error(res.data?.message || 'Gagal memperbarui data')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Terjadi kesalahan sistem saat update')
    }
  }

  const handleFormSubmit = (formData) => {
    const payload = { ...formData }

    if (payload.otoritas_id) {
      payload.otoritas_id = Number(payload.otoritas_id)
    } else {
      payload.otoritas_id = null
    }

    if (payload.bagian_id) {
      payload.bagian_id = Number(payload.bagian_id)
    } else {
      payload.bagian_id = null
    }

    if (!payload.phone) payload.phone = null

    payload.first_name = payload.first_name || ""
    payload.last_name = payload.last_name || ""
    payload.tanggal_lahir = payload.tanggal_lahir || ""

    if (editingId) {
      updateData(payload)
    } else {
      insertData(payload)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pegawai ini?')) return
    try {
      const res = await axios.delete(`${BaseUrl}/api/user/${id}`, config)
      if (res.status === 200) {
        toast.success('Pegawai berhasil dihapus!')
        fetchData()
      } else {
        toast.error(res.data?.message || 'Gagal menghapus')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Kesalahan koneksi')
    }
  }

  const handleToggleStatus = async (pegawai) => {
    const newStatus = pegawai.status === 'active' ? 'inactive' : 'active'
    const id = pegawai.ID || pegawai.id

    try {
      const res = await axios.put(`${BaseUrl}/api/user/${id}`, { status: newStatus }, config)

      if (res.status === 200) {
        toast.success(`Pegawai berhasil di-${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}`)
        fetchData()
      } else {
        toast.error(res.data?.message || 'Gagal mengubah status')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Kesalahan koneksi')
    }
  }

  const handleDeleteBerkas = async (berkasID) => {
    if (!window.confirm('Yakin ingin menghapus berkas ini secara permanen?')) return
    try {
      const res = await axios.delete(`${BaseUrl}/api/berkas/${berkasID}`, config)
      if (res.status === 200) {
        toast.success('Berkas berhasil dihapus!')
        setSelectedPegawai(res.data.data) // Update state modal
        fetchData() // Update state table
      } else {
        toast.error(res.data?.message || 'Gagal menghapus berkas')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Kesalahan koneksi saat menghapus berkas')
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: state.isFocused ? '#a855f7' : document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb',
      borderRadius: '0.75rem',
      padding: '0.2rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(168, 85, 247, 0.1)' : 'none',
      '&:hover': { borderColor: '#a855f7' }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      borderRadius: '1rem',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
      zIndex: 9999
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6') : 'transparent',
      color: state.isSelected ? '#ffffff' : (document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937'),
      cursor: 'pointer'
    }),
    singleValue: base => ({ ...base, color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937' })
  }

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const otoritasOptions = Object.values(OTORITAS).map((value) => ({
    value,
    label: getOtoritasName(value)
  }))

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiUserGroup className="text-purple-600 w-6 h-6" />
              </div>
              Manajemen Pegawai
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Kelola data akun dan berkas digital seluruh pegawai.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <button
              onClick={() => openFormModal()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95 whitespace-nowrap"
            >
              <HiPlus className="w-5 h-5" />
              <span>Tambah Pegawai</span>
            </button>
          </div>
        </div>

        {/* Custom Premium Table */}
        <CustomPremiumTable
          loading={loading}
          data={data}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onDetail={(row) => { setSelectedPegawai(row); setIsDetailModalOpen(true); }}
          onToggleStatus={handleToggleStatus}
          onEdit={openFormModal}
          onDelete={handleDelete}
        />


        {/* --- MODAL DETAIL (Glassmorphism Style) --- */}
        {isDetailModalOpen && selectedPegawai && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-auto max-h-[90vh] border border-white/20">
              <div className="w-full md:w-1/3 bg-purple-600 p-8 text-white flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md p-1 mb-6 shadow-xl relative overflow-hidden ring-4 ring-white/10">
                  {selectedPegawai.berkas?.find(b => b.jenis === 'foto_profil') ? (
                    <img src={`${BaseUrl}${selectedPegawai.berkas.find(b => b.jenis === 'foto_profil').path}`} className="w-full h-full object-cover rounded-[20px]" alt="" />
                  ) : (
                    <img src={getDefaultAvatar(selectedPegawai)} className="w-full h-full object-cover rounded-[20px]" alt="" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-center z-10">{selectedPegawai.nickname}</h3>
                <p className="text-purple-200 text-sm mb-2 z-10">{selectedPegawai.email}</p>
                <p className="text-purple-300 text-xs z-10">{selectedPegawai.first_name} {selectedPegawai.last_name}</p>
                <div className="z-10 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm mt-2">
                  {selectedPegawai.jenis_kelamin === 'L' ? <TbGenderMale className="text-blue-300" /> : <TbGenderFemale className="text-pink-300" />}
                  {selectedPegawai.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </div>
                <div className="z-10 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm mt-2">
                  {selectedPegawai.otoritas?.nama || 'No Role'}
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-white/50 dark:bg-gray-900/50 relative">
                <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md">
                  <HiX className="w-5 h-5" />
                </button>
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                  <HiIdentification className="text-purple-600" /> Berkas Digital
                </h4>

                <div className="grid gap-4">
                  {['lamaran', 'ijazah', 'transkrip', 'sertifikat'].map((jenis) => {
                    const docs = selectedPegawai.berkas?.filter(b => b.jenis === jenis) || []
                    return (
                      <div key={jenis} className="space-y-2">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">{jenis}</p>
                        {docs.length === 0 ? (
                          <div className="p-4 bg-gray-100/50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-xs text-gray-400 text-center">Belum ada berkas</div>
                        ) : (
                          docs.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group hover:border-purple-400 transition-all">
                              <div className="flex items-center overflow-hidden mr-4">
                                <HiIdentification className="text-purple-500 mr-3 flex-shrink-0" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{doc.nama || `Berkas ${jenis}`}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setPreviewFile({ url: `${BaseUrl}${doc.path}`, title: doc.nama || jenis })} className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all" title="Preview">
                                  <HiEye className="w-4 h-4" />
                                </button>
                                <a href={`${BaseUrl}${doc.path}`} download className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-800 hover:text-white transition-all" title="Download">
                                  <HiDownload className="w-4 h-4" />
                                </a>
                                <button onClick={() => handleDeleteBerkas(doc.ID || doc.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Hapus Berkas">
                                  <HiTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL FORM --- */}
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              <header className="px-8 py-6 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {editingId ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Lengkapi informasi dasar pegawai di bawah ini.</p>
                </div>
                <button onClick={closeFormModal} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nickname</span>
                    <Controller
                      name="nickname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          className="form-input mt-2"
                        />
                      )}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Status Akun</span>
                    <div className="mt-2">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            options={statusOptions}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            value={statusOptions.find(opt => opt.value === field.value)}
                            onChange={(opt) => field.onChange(opt ? opt.value : '')}
                          />
                        )}
                      />
                    </div>
                  </label>
                  <label className="block text-sm md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Otoritas / Role</span>
                    <div className="mt-2">
                      <Controller
                        name="otoritas_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            options={otoritasOptions}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            value={otoritasOptions.find(opt => opt.value === field.value)}
                            onChange={(opt) => field.onChange(opt ? opt.value : '')}
                          />
                        )}
                      />
                    </div>
                  </label>
                  <label className="block text-sm md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Bagian / Unit Kerja</span>
                    <div className="mt-2">
                      <Controller
                        name="bagian_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            options={bagianOptions}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            value={bagianOptions.find(opt => opt.value === field.value)}
                            onChange={(opt) => field.onChange(opt ? opt.value : '')}
                            placeholder="Pilih Bagian..."
                            isClearable
                          />
                        )}
                      />
                    </div>
                  </label>

                  <div className="md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Jenis Kelamin</span>
                    <div className="flex gap-4 mt-3">
                      <Controller
                        name="jenis_kelamin"
                        control={control}
                        render={({ field }) => (
                          <>
                            <label className="flex-1 cursor-pointer group">
                              <input
                                type="radio"
                                name={field.name}
                                value="L"
                                checked={field.value === 'L'}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                className="hidden peer"
                              />
                              <div className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-gray-100 dark:border-gray-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <TbGenderMale className="text-blue-500 w-5 h-5" />
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 peer-checked:text-blue-600">Laki-laki</span>
                              </div>
                            </label>
                            <label className="flex-1 cursor-pointer group">
                              <input
                                type="radio"
                                name={field.name}
                                value="P"
                                checked={field.value === 'P'}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                className="hidden peer"
                              />
                              <div className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-gray-100 dark:border-gray-700 peer-checked:border-pink-500 peer-checked:bg-pink-50 dark:peer-checked:bg-pink-900/20 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <TbGenderFemale className="text-pink-500 w-5 h-5" />
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 peer-checked:text-pink-600">Perempuan</span>
                              </div>
                            </label>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <label className="block text-sm md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Email Resmi</span>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input type="email" name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} className="form-input mt-2" />
                      )}
                    />
                  </label>
                  <label className="block text-sm md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Tanggal Lahir</span>
                    <Controller
                      name="tanggal_lahir"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input type="date" name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} className="form-input mt-2" />
                      )}
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">*Digunakan sebagai password default (Format: YYYYMMDD) jika ini pegawai baru</span>
                  </label>
                  <label className="block text-sm md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nomor Telepon/WA</span>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <input name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} className="form-input mt-2" />
                      )}
                    />
                  </label>
                </div>
                <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3 border-t dark:border-gray-700">
                  <button type="button" onClick={closeFormModal} className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="px-10 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg active:scale-95 transition-all">
                    {editingId ? 'Simpan Perubahan' : 'Daftarkan Pegawai'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10">
              <div className="flex items-center justify-between px-8 py-5 border-b bg-white dark:bg-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{previewFile.title}</h3>
                <button onClick={() => setPreviewFile(null)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm">
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 w-full bg-gray-50 relative">
                <iframe src={previewFile.url} className="w-full h-full border-none" title="PDF Preview" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Pegawai

