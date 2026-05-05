import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import AsyncSelect from 'react-select/async'

import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiCollection, HiSearch, HiPlus, HiPencil, HiTrash, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'

/**
 * Premium Table for Stok Barang (ATK)
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
              <th className="px-6 py-4">Nama Barang (Catalog)</th>
              <th className="px-6 py-4">Tipe / Spesifikasi</th>
              <th className="px-6 py-4">Stok Saat Ini</th>
              <th className="px-6 py-4">Satuan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-gray-500">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-gray-500">Tidak ada data stok.</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{row.master_barang?.nama_brg}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{row.master_barang?.kode_brg}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {row.master_detail?.tipe_barang || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-bold font-mono ${row.stok > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                      {row.stok}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm uppercase font-semibold text-gray-500">
                    {row.satuan?.nama_satuan || '-'}
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

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Halaman {currentPage} dari {totalPages || 1}</span>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"><HiChevronLeft /></button>
          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"><HiChevronRight /></button>
        </div>
      </div>
    </div>
  )
}

function StokBarang() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      master_barang_id: '',
      satuan_id: '',
      stok: 0,
      tanggal_masuk: '',
      jenis_transaksi: 'Initial Stock'
    }
  })

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: state.isFocused ? '#3b82f6' : document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb',
      borderRadius: '1rem',
      padding: '0.2rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': { borderColor: '#3b82f6' }
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
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6') : 'transparent',
      color: state.isSelected ? '#ffffff' : (document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937'),
      cursor: 'pointer'
    }),
    singleValue: base => ({ ...base, color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937' }),
    placeholder: base => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' })
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/record/barang/cari`, {
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


  const loadBarang = async (inputValue, callback) => {
    try {
      const res = await fetch(`${BaseUrl}/api/master/barang/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "nama_brg asc" })
      })
      const result = await res.json()
      if (res.ok) {
        callback(result.data?.map(m => ({ label: `${m.nama_brg} (${m.kode_brg})`, value: m.ID })) || [])
      }
    } catch (e) { console.error(e) }
  }

  const loadSatuan = async (inputValue, callback) => {
    try {
      const res = await fetch(`${BaseUrl}/api/master/satuan/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "nama_satuan asc" })
      })
      const result = await res.json()
      if (res.ok) {
        callback(result.data?.map(s => ({ label: s.nama_satuan, value: s.ID })) || [])
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchData())
  }, [fetchData])

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.ID || item.id)
      reset({
        master_barang_id: item.master_barang_id || '',
        satuan_id: item.satuan_id || '',
        stok: item.stok || 0,
        tanggal_masuk: item.tanggal_masuk ? new Date(item.tanggal_masuk).toISOString().split('T')[0] : '',
        jenis_transaksi: item.jenis_transaksi || 'Update Stock'
      })
    } else {
      setEditingId(null)
      reset({
        master_barang_id: '',
        satuan_id: '',
        stok: 0,
        tanggal_masuk: new Date().toISOString().split('T')[0],
        jenis_transaksi: 'Initial Stock'
      })
    }
    setIsModalOpen(true)
  }

  const onFormSubmit = async (formData) => {
    try {
      const url = `${BaseUrl}/api/record/barang/`
      const method = editingId ? 'PUT' : 'POST'

      // Ensure numeric fields are numbers
      const formattedData = {
        ...formData,
        stok: parseInt(formData.stok) || 0,
        master_barang_id: parseInt(formData.master_barang_id) || 0,
        satuan_id: parseInt(formData.satuan_id) || 0
      }

      const payload = editingId ? { ...formattedData, id: parseInt(editingId) } : formattedData

      const res = await fetch(url, {
        method,
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (res.ok) {
        toast.success(editingId ? 'Data stok diperbarui!' : 'Stok barang ditambahkan!')
        setIsModalOpen(false)
        fetchData()
      } else {
        toast.error(result.message || 'Gagal menyimpan data')
      }
    } catch {
      toast.error('Terjadi kesalahan sistem')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus record stok ini?')) return
    try {
      const res = await fetch(`${BaseUrl}/api/record/barang/${id}`, {
        method: 'DELETE',
        headers: UserHelper.authHeader()
      })
      if (res.ok) {
        toast.success('Record stok dihapus')
        fetchData()
      } else {
        toast.error('Gagal menghapus data')
      }
    } catch { toast.error('Kesalahan sistem') }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <HiCollection className="text-blue-600 w-6 h-6" />
              </div>
              Stok Barang (ATK)
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Monitor ketersediaan stok fisik barang di gudang.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari stok barang..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none"
                value={searchTerm}
                onChange={(e) => {
                   setSearchTerm(e.target.value)
                   setCurrentPage(1)
                }}
              />
            </div>
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg"
            >
              <HiPlus className="w-5 h-5" />
              <span>Tambah Stok</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{editingId ? 'Update Stok Barang' : 'Tambah Stok Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-all">
                  <HiX className="w-6 h-6" />
                </button>
              </header>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="block text-sm md:col-span-2">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Barang (Catalog)</span>
                    <div className="mt-2">
                       <Controller
                         name="master_barang_id"
                         control={control}
                         render={({ field }) => (
                           <AsyncSelect
                             {...field}
                             cacheOptions
                             defaultOptions
                             loadOptions={loadBarang}
                             placeholder="Cari Barang..."
                             classNamePrefix="select"
                             styles={selectStyles}
                             value={field.value ? { label: "Item Terpilih", value: field.value } : null}
                             onChange={(opt) => field.onChange(opt ? opt.value : '')}
                           />
                         )}
                       />
                    </div>
                  </div>
                  <div className="block text-sm">
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
                             placeholder="Cari Satuan..."
                             classNamePrefix="select"
                             styles={selectStyles}
                             value={field.value ? { label: "Satuan Terpilih", value: field.value } : null}
                             onChange={(opt) => field.onChange(opt ? opt.value : '')}
                           />
                         )}
                       />
                    </div>
                  </div>

                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Stok</span>
                    <input
                      {...register('stok', { required: true })}
                      type="number"
                      placeholder="0"
                      className="form-input mt-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Tanggal</span>
                    <input
                      {...register('tanggal_masuk', { required: true })}
                      type="date"
                      className="form-input mt-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Jenis Transaksi</span>
                    <input
                      {...register('jenis_transaksi')}
                      placeholder="Contoh: Stok Awal"
                      className="form-input mt-2"
                    />
                  </label>
                </div>
                <footer className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3 border-t dark:border-gray-700">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="px-8 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
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

export default StokBarang

