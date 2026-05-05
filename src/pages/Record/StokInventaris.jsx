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

  const [selectedOptions, setSelectedOptions] = useState({
    barang: null,
    satuan: null,
    ruangan: null,
    kondisi: { label: 'Baik', value: 'Baik' }
  })

  const kondisiOptions = [
    { label: 'Baik', value: 'Baik' },
    { label: 'Rusak Ringan', value: 'Rusak Ringan' },
    { label: 'Rusak Berat', value: 'Rusak Berat' }
  ]






  const [formData, setFormData] = useState({
    master_barang_id: '',
    satuan_id: '',
    ruangan_id: '',
    kondisi: 'Baik',
    spesifikasi: '',
    tgl_perolehan: ''
  })

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: state.isFocused ? '#f97316' : document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb',
      borderRadius: '1rem',
      padding: '0.2rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(249, 115, 22, 0.1)' : 'none',
      '&:hover': { borderColor: '#f97316' }
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
      backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6') : 'transparent',
      color: state.isSelected ? '#ffffff' : (document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937'),
      cursor: 'pointer'
    }),
    singleValue: base => ({ ...base, color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937' }),
    placeholder: base => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' })
  }

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
        body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "nama_brg asc", tipe_id: 1 })
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

  const loadKondisi = (inputValue, callback) => {
    const filtered = kondisiOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )
    callback(filtered)
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
        master_barang_id: item.master_barang_id || '',
        satuan_id: item.satuan_id || '',
        ruangan_id: item.ruangan_id || '',
        kondisi: item.kondisi || 'Baik',
        spesifikasi: item.spesifikasi || '',
        tgl_perolehan: item.tgl_perolehan ? item.tgl_perolehan.split('T')[0] : '',
        qrcode: item.qrcode || '',
        kode_inventaris: item.kode_inventaris || ''
      })
      setSelectedOptions({
        barang: item.barang ? { label: item.barang.nama_brg, value: item.barang.ID } : null,
        satuan: item.satuan ? { label: item.satuan.nama_satuan, value: item.satuan.ID } : null,
        ruangan: item.ruangan ? { label: item.ruangan.nama_ruangan, value: item.ruangan.ID } : null,
        kondisi: item.kondisi ? { label: item.kondisi, value: item.kondisi } : { label: 'Baik', value: 'Baik' }
      })
    } else {
      setEditingId(null)
      setFormData({
        master_barang_id: '',
        satuan_id: '',
        ruangan_id: '',
        kondisi: 'Baik',
        spesifikasi: '',
        tgl_perolehan: new Date().toISOString().split('T')[0]
      })
      setSelectedOptions({
        barang: null,
        satuan: null,
        ruangan: null,
        kondisi: { label: 'Baik', value: 'Baik' }
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
              <input type="text" placeholder="Cari kode/nama..." className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => openModal()} className="px-6 py-2 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-orange-700 transition-all">+ Tambah Aset</button>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-bold text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-left">No</th>
                  <th className="px-6 py-4 text-left">QR Code</th>
                  <th className="px-6 py-4 text-left">Kode Inventaris</th>
                  <th className="px-6 py-4 text-left">Nama Aset</th>
                  <th className="px-6 py-4 text-left">Lokasi</th>
                  <th className="px-6 py-4 text-left">Kondisi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center">Memuat...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center">Tidak ada data.</td></tr>
                ) : (
                  data.map((row, index) => (

                    <tr key={row.ID} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-400 transition-colors">
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">
                        {row.qrcode ? (
                          <img src={row.qrcode} alt="QR" className="w-10 h-10 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 bg-white p-1 cursor-zoom-in" onClick={() => openModal(row)} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[8px] text-gray-400 uppercase">No QR</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-orange-600">{row.kode_inventaris}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 dark:text-gray-200">{row.master_barang?.nama_brg}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{row.master_barang?.kode_brg}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{row.ruangan?.nama_ruangan || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.kondisi === 'Baik' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>{row.kondisi}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openModal(row)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"><HiPencil className="w-5 h-5" /></button>
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
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-gray-400 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm"><HiChevronLeft className="w-5 h-5" /></button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-gray-400 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm"><HiChevronRight className="w-5 h-5" /></button>
          </div>
        </div>


        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <header className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{editingId ? 'Edit Inventaris' : 'Tambah Inventaris'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-all"><HiX className="w-6 h-6" /></button>
              </header>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className={`grid grid-cols-1 ${editingId ? 'md:grid-cols-3' : ''} gap-5`}>
                  {editingId && (
                    <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 border border-dashed border-gray-200 dark:border-gray-700">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">QR Asset</span>
                      {formData.qrcode ? (
                        <div className="bg-white p-2 rounded-xl shadow-inner">
                          <img src={formData.qrcode} alt="QR" className="w-32 h-32" />
                          <p className="text-[8px] text-center text-gray-400 mt-1 font-mono uppercase">{formData.kode_inventaris}</p>
                        </div>
                      ) : (
                        <div className="w-32 h-32 flex flex-col items-center justify-center text-gray-300 text-center">
                          <HiBriefcase className="w-12 h-12 opacity-20" />
                          <p className="text-[9px] mt-2 italic">No QR Available</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`${editingId ? 'md:col-span-2' : ''} space-y-5`}>
                    <div className="block text-sm"><span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Barang (Catalog)</span>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadBarang}
                        placeholder="Pilih Barang..."
                        className="mt-1"
                        classNamePrefix="select"
                        styles={selectStyles}
                        onChange={(opt) => {
                          setFormData({ ...formData, master_barang_id: opt?.value })
                          setSelectedOptions(prev => ({ ...prev, barang: opt }))
                        }}
                        value={selectedOptions.barang}
                      />
                    </div>
                    <div className="block text-sm"><span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Ruangan</span>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadRuangan}
                        placeholder="Pilih Ruangan..."
                        className="mt-1"
                        classNamePrefix="select"
                        styles={selectStyles}
                        onChange={(opt) => {
                          setFormData({ ...formData, ruangan_id: opt?.value })
                          setSelectedOptions(prev => ({ ...prev, ruangan: opt }))
                        }}
                        value={selectedOptions.ruangan}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <label className="block text-sm"><span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Kondisi</span>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadKondisi}
                      className="mt-1"
                      classNamePrefix="select"
                      styles={selectStyles}
                      onChange={(opt) => {
                        setFormData({ ...formData, kondisi: opt?.value })
                        setSelectedOptions(prev => ({ ...prev, kondisi: opt }))
                      }}
                      value={selectedOptions.kondisi}
                    />
                  </label>
                  <div className="block text-sm"><span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Satuan</span>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadSatuan}
                      placeholder="Pilih Satuan..."
                      className="mt-1"
                      classNamePrefix="select"
                      styles={selectStyles}
                      onChange={(opt) => {
                        setFormData({ ...formData, satuan_id: opt?.value })
                        setSelectedOptions(prev => ({ ...prev, satuan: opt }))
                      }}
                      value={selectedOptions.satuan}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <label className="block text-sm"><span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Tgl Perolehan</span>
                    <input name="tgl_perolehan" type="date" className="form-input mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.tgl_perolehan} onChange={handleInputChange} />
                  </label>
                  <label className="block text-sm"><span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px]">Spesifikasi Tambahan</span>
                    <textarea name="spesifikasi" className="form-input mt-1 h-24 dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.spesifikasi} onChange={handleInputChange} placeholder="Contoh: Serial Number, Warna, Kapasitas, dll..." />
                  </label>
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="px-8 py-2 text-sm font-bold text-white bg-orange-600 rounded-xl shadow-lg hover:bg-orange-700 active:scale-95 transition-all">Simpan</button>
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
