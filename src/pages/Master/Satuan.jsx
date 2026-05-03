import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiCube, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'

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
              <th className="px-6 py-4">Nama Satuan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-gray-500">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-20 text-center text-gray-500">
                  Tidak ada data satuan.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{row.nama_satuan}</span>
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

function Satuan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")
  const [config] = useState(() => UserHelper.axiosConfig())

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      nama_satuan: ''
    }
  })

  // --- Data Fetching ---
  const fetchData = useCallback(async (searchVal = searchTerm) => {
    if (!config) return
    setLoading(true)
    try {
      const { data } = await axios.post(`${BaseUrl}/api/master/satuan/cari`, {
        "Search": searchVal || null,
        "Limit": String(itemsPerPage),
        "Page": String(currentPage),
        "Order": order
      }, config)

      setData(data.data || [])
      setTotalItems(data.total || 0)
    } catch (error) {
      console.error(error)
      toast.error('Gagal mengambil data')
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

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.ID || item.id)
      setValue('nama_satuan', item.nama_satuan)
    } else {
      setEditingId(null)
      reset({ nama_satuan: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    reset({ nama_satuan: '' })
    setEditingId(null)
  }

  const onFormSubmit = async (formData) => {
    try {
      const url = `${BaseUrl}/api/master/satuan/`
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = editingId 
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config)

      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? 'Satuan diperbarui!' : 'Satuan ditambah!')
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
    if (!window.confirm('Yakin ingin menghapus satuan ini?')) return
    try {
      const res = await axios.delete(`${BaseUrl}/api/master/satuan/${id}`, config)
      if (res.status === 200) {
        toast.success('Satuan dihapus!')
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

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiCube className="text-purple-600 w-6 h-6" />
              </div>
              Master Satuan
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Kelola unit pengukuran untuk barang inventaris.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari satuan..."
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
              <span>Tambah Satuan</span>
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
            <div className="w-full max-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? 'Edit Satuan' : 'Tambah Satuan Baru'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="p-8">
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Nama Satuan</span>
                    <input
                      {...register('nama_satuan', { required: true })}
                      placeholder="Contoh: PCS, Unit, Box"
                      className="form-input mt-2"
                    />
                  </label>
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

export default Satuan

