import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiOfficeBuilding, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'

/**
 * Premium Custom Table for Bagian
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
              <th className="px-6 py-4">Nama Bagian</th>
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
                    Tidak ada data bagian.
                 </td>
               </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{row.nama}</span>
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

function Bagian() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [formData, setFormData] = useState({
    nama: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/bagian/`, {
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.ID || item.id)
      setFormData({ nama: item.nama })
    } else {
      setEditingId(null)
      setFormData({ nama: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({ nama: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingId ? `${BaseUrl}/api/bagian/${editingId}` : `${BaseUrl}/api/bagian/`
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...UserHelper.authHeader()
        },
        body: JSON.stringify(formData)
      })

      const result = await res.json()
      if (res.ok) {
        toast.success(editingId ? 'Bagian diperbarui!' : 'Bagian ditambah!')
        closeModal()
        fetchData()
      } else {
        toast.error(result.message || 'Gagal menyimpan data')
      }
    } catch {
      toast.error('Terjadi kesalahan sistem')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus bagian ini?')) return
    try {
      const res = await fetch(`${BaseUrl}/api/bagian/${id}`, {
        method: 'DELETE',
        headers: UserHelper.authHeader()
      })
      if (res.ok) {
        toast.success('Bagian dihapus!')
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal menghapus')
      }
    } catch {
      toast.error('Kesalahan koneksi')
    }
  }

  const filteredData = useMemo(() => {
    return data.filter(item => 
      (item.nama || '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiOfficeBuilding className="text-purple-600 w-6 h-6" />
              </div>
              Master Bagian
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Kelola data divisi atau unit kerja organisasi.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari bagian..."
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
              <span>Tambah Bagian</span>
            </button>
          </div>
        </div>

        <CustomPremiumTable 
          loading={loading}
          data={paginatedData}
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
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? 'Edit Bagian' : 'Tambah Bagian Baru'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all text-gray-400">
                  <HiX className="w-6 h-6" />
                </button>
              </header>
              <form onSubmit={handleSubmit}>
                <div className="p-8">
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold">Nama Bagian</span>
                    <input
                      name="nama"
                      required
                      placeholder="Masukkan nama unit..."
                      className="form-input mt-2"
                      value={formData.nama}
                      onChange={handleInputChange}
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

export default Bagian
