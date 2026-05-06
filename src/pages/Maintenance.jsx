import { useState, useEffect, useCallback } from 'react'
import AsyncSelect from 'react-select/async'

import Layout from '../layout/Layout'
import { BaseUrl } from '../helper/api'
import { UserHelper } from '../helper/user'
import toast from 'react-hot-toast'
import { HiCog, HiSearch, HiPlus, HiPencil, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'

const Maintenance = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")




  const [formData, setFormData] = useState({
    inventaris_id: '',
    inventaris_label: '',
    tanggal_jadwal: '',
    tanggal_selesai: '',
    biaya: 0,
    keterangan: '',
    hasil_servis: '',
    status: 'Pending'
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/record/maintenance/cari`, {
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



  const loadInventaris = async (inputValue) => {
    try {
      const res = await fetch(`${BaseUrl}/api/record/inventaris/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "kode_inventaris asc" })
      })
      const result = await res.json()
      if (res.ok) {
        return result.data?.map(i => ({ 
          label: `${i.kode_inventaris} - ${i.master_detail?.master_data?.nama_brg || ''}`, 
          value: i.ID 
        })) || []
      }
      return []
    } catch (e) { 
      console.error(e) 
      return []
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchData())
  }, [fetchData])


  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openModal = (item = null) => {

    if (item) {
      setEditingId(item.ID || item.id)
      setFormData({
        inventaris_id: item.inventaris_id || '',
        inventaris_label: item.inventaris ? `${item.inventaris.kode_inventaris} - ${item.inventaris.master_barang?.nama_brg || ''}` : '',
        tanggal_jadwal: item.tanggal_jadwal || '',
        tanggal_selesai: item.tanggal_selesai || '',
        biaya: item.biaya || 0,
        keterangan: item.keterangan || '',
        hasil_servis: item.hasil_servis || '',
        status: item.status || 'Pending'
      })
    } else {
      setEditingId(null)
      setFormData({
        inventaris_id: '',
        inventaris_label: '',
        tanggal_jadwal: new Date().toISOString().split('T')[0],
        tanggal_selesai: '',
        biaya: 0,
        keterangan: '',
        hasil_servis: '',
        status: 'Pending'
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = `${BaseUrl}/api/record/maintenance/`
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { ...formData, id: editingId } : formData
      const res = await fetch(url, {
        method,
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(editingId ? 'Data diperbarui!' : 'Data dicatat!')
        setIsModalOpen(false)
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal menyimpan')
      }
    } catch { toast.error('Kesalahan sistem') }
  }

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <HiCog className="text-purple-600 w-6 h-6" />
              </div>
              Manajemen Maintenance
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Kelola jadwal pemeliharaan dan perbaikan aset.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari maintenance..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => openModal()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-2xl shadow-lg">
              <HiPlus className="w-5 h-5" />
              <span>Catat Maintenance</span>
            </button>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Biaya</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Memuat...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Tidak ada data.</td></tr>
                ) : (
                  data.map((row, index) => (

                    <tr key={row.ID || index} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{row.inventaris?.master_barang?.nama_brg || 'Unknown'}</span>
                          <span className="text-[10px] text-purple-600">{row.inventaris?.kode_inventaris || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{row.tanggal_jadwal}</td>
                      <td className="px-6 py-4 text-sm font-mono font-bold text-green-600">Rp {new Intl.NumberFormat('id-ID').format(row.biaya || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                          row.status === 'Completed' ? 'bg-green-50 text-green-700' : row.status === 'Pending' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openModal(row)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"><HiPencil className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-between items-center">
             <span className="text-xs">Hal {currentPage} dari {totalPages || 1}</span>
             <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border rounded-xl disabled:opacity-30"><HiChevronLeft /></button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border rounded-xl disabled:opacity-30"><HiChevronRight /></button>
             </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <header className="px-8 py-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Maintenance' : 'Catat Maintenance'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500"><HiX className="w-6 h-6" /></button>
              </header>
              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="block text-sm md:col-span-2"><span className="font-bold text-[10px] uppercase text-gray-500">Asset Inventaris</span>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadInventaris}
                    placeholder="Cari Asset..."
                    className="mt-2"
                    classNamePrefix="select"
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    onChange={(opt) => setFormData({ ...formData, inventaris_id: opt?.value, inventaris_label: opt?.label })}
                    value={formData.inventaris_id ? { label: formData.inventaris_label || "Asset Terpilih", value: formData.inventaris_id } : null}
                  />
                </div>

                <label className="block text-sm"><span className="font-bold text-[10px] uppercase text-gray-500">Tanggal Jadwal</span>
                  <input name="tanggal_jadwal" type="date" required className="form-input mt-2" value={formData.tanggal_jadwal} onChange={handleInputChange} />
                </label>
                <label className="block text-sm"><span className="font-bold text-[10px] uppercase text-gray-500">Tanggal Selesai</span>
                  <input name="tanggal_selesai" type="date" className="form-input mt-2" value={formData.tanggal_selesai} onChange={handleInputChange} />
                </label>
                <label className="block text-sm"><span className="font-bold text-[10px] uppercase text-gray-500">Biaya (Rp)</span>
                  <input name="biaya" type="number" required className="form-input mt-2" value={formData.biaya} onChange={handleInputChange} />
                </label>
                <label className="block text-sm"><span className="font-bold text-[10px] uppercase text-gray-500">Status</span>
                  <select name="status" className="form-input mt-2" value={formData.status} onChange={handleInputChange}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
                <label className="block text-sm md:col-span-2"><span className="font-bold text-[10px] uppercase text-gray-500">Keterangan</span>
                  <textarea name="keterangan" className="form-input mt-2 h-20 resize-none" value={formData.keterangan} onChange={handleInputChange} />
                </label>
                <label className="block text-sm md:col-span-2"><span className="font-bold text-[10px] uppercase text-gray-500">Hasil Servis</span>
                  <textarea name="hasil_servis" className="form-input mt-2 h-20 resize-none" value={formData.hasil_servis} onChange={handleInputChange} />
                </label>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                  <button type="submit" className="px-8 py-2 text-white bg-purple-600 rounded-xl shadow-lg">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Maintenance
