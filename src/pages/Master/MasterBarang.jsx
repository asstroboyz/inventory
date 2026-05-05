import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import { createCariPayload } from '../../helper/tableHelper'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiArchive, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'
import AsyncSelect from 'react-select/async'

/**
 * Premium Custom Table for Master Barang
 */
const CustomPremiumTable = ({ 
  loading, 
  data, 
  currentPage, 
  itemsPerPage, 
  totalPages, 
  setCurrentPage, 
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
              <th className="px-6 py-4">Barang</th>
              <th className="px-6 py-4">Kategori & Merk</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {loading ? (
               <tr>
                 <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-sm font-semibold text-gray-500">Memuat data...</span>
                    </div>
                 </td>
               </tr>
            ) : data.length === 0 ? (
               <tr>
                 <td colSpan="4" className="px-6 py-20 text-center text-gray-500">
                    Tidak ada data barang.
                 </td>
               </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{row.nama_brg}</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold">{row.kode_brg || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 rounded text-[10px] font-bold uppercase">{row.jenis?.nama_jenis || '-'}</span>
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300 rounded text-[10px] font-bold uppercase">{row.merk?.nama_merk || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => onEdit(row)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                        <HiPencil className="w-5 h-5" />
                      </button>
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

function MasterBarang() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")
  const [config] = useState(() => UserHelper.axiosConfig())

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      nama_brg: '',
      jenis_id: '',
      merk_id: '',
      satuan_id: ''
    }
  })

  const loadJenis = useCallback(async (inputValue, callback) => {
    if (!config) return
    try {
      const { data } = await axios.post(`${BaseUrl}/api/master/jenis-barang/cari`, 
        createCariPayload(1, 50, "nama_jenis asc", inputValue), 
        config
      )
      callback(data.data?.map(j => ({ label: j.nama_jenis, value: j.ID })) || [])
    } catch (e) { console.error(e) }
  }, [config])

  const loadMerk = useCallback(async (inputValue, callback) => {
    if (!config) return
    try {
      const { data } = await axios.post(`${BaseUrl}/api/master/merk/cari`, 
        createCariPayload(1, 50, "nama_merk asc", inputValue), 
        config
      )
      callback(data.data?.map(m => ({ label: m.nama_merk, value: m.ID })) || [])
    } catch (e) { console.error(e) }
  }, [config])

  const loadSatuan = useCallback(async (inputValue, callback) => {
    if (!config) return
    try {
      const { data } = await axios.post(`${BaseUrl}/api/master/satuan/cari`, 
        createCariPayload(1, 50, "nama_satuan asc", inputValue), 
        config
      )
      callback(data.data?.map(s => ({ label: s.nama_satuan, value: s.ID })) || [])
    } catch (e) { console.error(e) }
  }, [config])

  // --- Data Fetching ---
  const fetchData = useCallback(async (searchVal = searchTerm) => {
    if (!config) return
    setLoading(true)
    try {
      const { data } = await axios.post(`${BaseUrl}/api/master/barang/cari`, 
        createCariPayload(currentPage, itemsPerPage, order, searchVal), 
        config
      )

      setData(data.data || [])
      setTotalItems(data.total || 0)
    } catch (error) {
      console.error(error)
      toast.error('Gagal mengambil data barang')
    } finally {
      setLoading(false)
    }
  }, [config, currentPage, itemsPerPage, order])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchTerm)
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, fetchData])

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.ID || item.id)
      reset({
        nama_brg: item.nama_brg || '',
        jenis_id: item.jenis_id || '',
        merk_id: item.merk_id || '',
        satuan_id: item.satuan_id || ''
      })
    } else {
      setEditingId(null)
      reset({
        nama_brg: '',
        jenis_id: '',
        merk_id: '',
        satuan_id: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    reset({
      nama_brg: '',
      jenis_id: '',
      merk_id: ''
    })
    setEditingId(null)
  }

  const onFormSubmit = async (formData) => {
    try {
      const url = `${BaseUrl}/api/master/barang/`
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = editingId 
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config)

      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? 'Data barang diperbarui!' : 'Barang baru ditambahkan!')
        closeModal()
        fetchData()
      } else {
        toast.error(res.data?.message || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Terjadi kesalahan sistem')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus barang ini?')) return
    try {
      const res = await axios.delete(`${BaseUrl}/api/master/barang/${id}`, config)
      if (res.status === 200) {
        toast.success('Barang dihapus!')
        fetchData()
      } else {
        toast.error(res.data?.message || 'Gagal menghapus')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Kesalahan koneksi')
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
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6') : 'transparent',
      color: state.isSelected ? '#ffffff' : (document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937'),
      cursor: 'pointer'
    }),
    singleValue: base => ({ ...base, color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937' })
  }

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiArchive className="text-purple-600 w-6 h-6" />
              </div>
              Master Data Barang
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Kelola katalog barang utama yang tersedia di sistem.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari barang..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-2xl hover:bg-purple-700 transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              <HiPlus className="w-5 h-5" />
              <span>Tambah Barang</span>
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
          onEdit={openModal}
          onDelete={handleDelete}
        />

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? 'Edit Data Barang' : 'Tambah Barang Baru'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Nama Barang</span>
                      <input
                        {...register('nama_brg', { required: true })}
                        placeholder="Contoh: Laptop Latitude"
                        className="form-input mt-2"
                      />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Jenis Barang</span>
                      <div className="mt-2">
                        <Controller
                          name="jenis_id"
                          control={control}
                          render={({ field }) => (
                            <AsyncSelect
                              {...field}
                              cacheOptions
                              defaultOptions
                              loadOptions={loadJenis}
                              styles={selectStyles}
                              value={field.value ? { label: "Selected Jenis", value: field.value } : null}
                              onChange={(opt) => field.onChange(opt ? opt.value : '')}
                            />
                          )}
                        />
                      </div>
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Merk Barang</span>
                      <div className="mt-2">
                        <Controller
                          name="merk_id"
                          control={control}
                          render={({ field }) => (
                            <AsyncSelect
                              {...field}
                              cacheOptions
                              defaultOptions
                              loadOptions={loadMerk}
                              styles={selectStyles}
                              value={field.value ? { label: "Selected Merk", value: field.value } : null}
                              onChange={(opt) => field.onChange(opt ? opt.value : '')}
                            />
                          )}
                        />
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Satuan</span>
                      <div className="mt-2">
                        <Controller
                          name="satuan_id"
                          control={control}
                          render={({ field }) => (
                            <AsyncSelect
                              {...field}
                              cacheOptions
                              defaultOptions
                              loadOptions={loadSatuan}
                              styles={selectStyles}
                              value={field.value ? { label: "Selected Satuan", value: field.value } : null}
                              onChange={(opt) => field.onChange(opt ? opt.value : '')}
                            />
                          )}
                        />
                      </div>
                    </label>
                  </div>
                </div>
                <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3 border-t dark:border-gray-700">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="px-8 py-2 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg active:scale-95 transition-all">
                    Simpan
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MasterBarang

