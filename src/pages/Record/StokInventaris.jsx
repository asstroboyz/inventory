import { useState, useEffect, useCallback } from 'react'
import AsyncSelect from 'react-select/async'

import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiBriefcase, HiSearch, HiPencil, HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'


const StokInventaris = () => {
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
    kode_inventaris: '',
    master_detail_id: '',
    satuan_id: '',
    ruangan_id: '',
    kondisi: 'Baik',
    spesifikasi: '',
    tgl_perolehan: ''
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BaseUrl}/api/record/inventaris/cari`, {
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
      toast.error('Koneksi terputus')
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
        const options = []
        result.data?.forEach(m => {
          m.details?.forEach(d => {
            options.push({ label: `${m.nama_brg} - ${d.tipe_barang} (${d.barcode})`, value: d.ID })
          })
        })
        callback(options)
      }
    } catch (e) { console.error(e) }
  }

  const loadSatuan = async (inputValue, callback) => {
    try {
      const res = await fetch(`${BaseUrl}/api/master/satuan/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "satuan_nama asc" })
      })
      const result = await res.json()
      if (res.ok) {
        callback(result.data?.map(s => ({ label: s.satuan_nama, value: s.ID })) || [])
      }
    } catch (e) { console.error(e) }
  }

  const loadRuangan = async (inputValue, callback) => {
    try {
      const res = await fetch(`${BaseUrl}/api/master/ruangan/cari`, {
        method: 'POST',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "nama_ruangan asc" })
      })
      const result = await res.json()
      if (res.ok) {
        callback(result.data?.map(r => ({ label: r.nama_ruangan, value: r.ID })) || [])
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchData())
  }, [fetchData])




  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.ID)
      setFormData({
        kode_inventaris: item.kode_inventaris || '',
        master_detail_id: item.master_detail_id || '',
        satuan_id: item.satuan_id || '',
        ruangan_id: item.ruangan_id || '',
        kondisi: item.kondisi || 'Baik',
        spesifikasi: item.spesifikasi || '',
        tgl_perolehan: item.tgl_perolehan || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        kode_inventaris: '',
        master_detail_id: '',
        satuan_id: '',
        ruangan_id: '',
        kondisi: 'Baik',
        spesifikasi: '',
        tgl_perolehan: new Date().toISOString().split('T')[0]
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = `${BaseUrl}/api/record/inventaris/`
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { ...formData, id: editingId } : formData
      const res = await fetch(url, {
        method,
        headers: UserHelper.jsonHeader(),

        body: JSON.stringify(payload)
      })
      if (res.ok) {
        toast.success('Data inventaris disimpan!')
        setIsModalOpen(false)
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal menyimpan')
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
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl"><HiBriefcase className="text-orange-600 w-6 h-6" /></div>
              Daftar Inventaris (Aset)
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-11">Manajemen fisik aset dan inventaris per ruangan.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari kode/nama..." className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border rounded-2xl outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => openModal()} className="px-6 py-2 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-orange-700 transition-all">+ Tambah Aset</button>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-bold text-gray-500 uppercase border-b bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-left">No</th>
                  <th className="px-6 py-4 text-left">Kode Inventaris</th>
                  <th className="px-6 py-4 text-left">Nama Aset</th>
                  <th className="px-6 py-4 text-left">Lokasi</th>
                  <th className="px-6 py-4 text-left">Kondisi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center">Memuat...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center">Tidak ada data.</td></tr>
                ) : (
                  data.map((row, index) => (

                    <tr key={row.ID} className="text-sm hover:bg-gray-50">
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 font-mono font-bold text-orange-600">{row.kode_inventaris}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{row.master_detail?.master_data?.nama_brg}</span>
                          <span className="text-[10px] text-gray-400">{row.master_detail?.tipe_barang}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{row.ruangan?.ruangan_nama || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.kondisi === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.kondisi}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openModal(row)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><HiPencil className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-between items-center rounded-b-2xl">
           <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Hal {currentPage} dari {totalPages || 1}</span>
           <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border rounded-xl disabled:opacity-30 hover:bg-white transition-all shadow-sm"><HiChevronLeft className="w-5 h-5"/></button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border rounded-xl disabled:opacity-30 hover:bg-white transition-all shadow-sm"><HiChevronRight className="w-5 h-5"/></button>
           </div>
        </div>


        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <header className="px-8 py-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Inventaris' : 'Tambah Inventaris'}</h3>
                <button onClick={() => setIsModalOpen(false)}><HiX className="w-6 h-6 text-gray-400" /></button>
              </header>
              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-4">
                <label className="block text-sm"><span>Kode Inventaris</span>
                  <input name="kode_inventaris" className="form-input mt-1" required value={formData.kode_inventaris} onChange={handleInputChange} />
                </label>
                <div className="block text-sm"><span>Barang (Catalog)</span>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadBarang}
                    placeholder="Pilih Barang..."
                    className="mt-1"
                    classNamePrefix="select"
                    onChange={(opt) => setFormData({ ...formData, master_detail_id: opt?.value })}
                    value={formData.master_detail_id ? { label: "Selected Barang", value: formData.master_detail_id } : null}
                  />
                </div>
                <div className="block text-sm"><span>Ruangan</span>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadRuangan}
                    placeholder="Pilih Ruangan..."
                    className="mt-1"
                    classNamePrefix="select"
                    onChange={(opt) => setFormData({ ...formData, ruangan_id: opt?.value })}
                    value={formData.ruangan_id ? { label: "Selected Ruangan", value: formData.ruangan_id } : null}
                  />
                </div>

                <label className="block text-sm"><span>Kondisi</span>
                  <select name="kondisi" className="form-input mt-1" value={formData.kondisi} onChange={handleInputChange}>
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </label>
                <div className="block text-sm"><span>Satuan</span>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadSatuan}
                    placeholder="Pilih Satuan..."
                    className="mt-1"
                    classNamePrefix="select"
                    onChange={(opt) => setFormData({ ...formData, satuan_id: opt?.value })}
                    value={formData.satuan_id ? { label: "Selected Satuan", value: formData.satuan_id } : null}
                  />
                </div>

                <label className="block text-sm"><span>Tgl Perolehan</span>
                  <input name="tgl_perolehan" type="date" className="form-input mt-1" value={formData.tgl_perolehan} onChange={handleInputChange} />
                </label>
                <label className="block text-sm col-span-2"><span>Spesifikasi Tambahan</span>
                  <textarea name="spesifikasi" className="form-input mt-1 h-20" value={formData.spesifikasi} onChange={handleInputChange} />
                </label>
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                  <button type="submit" className="px-8 py-2 bg-orange-600 text-white rounded-xl shadow-lg">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default StokInventaris
