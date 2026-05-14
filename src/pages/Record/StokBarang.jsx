import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import AsyncSelect from 'react-select/async'

import Layout from '../../layout/Layout'
import { BaseUrl } from '../../helper/api'
import { UserHelper } from '../../helper/user'
import toast from 'react-hot-toast'
import { HiCollection, HiSearch, HiPlus, HiPencil, HiTrash, HiChevronLeft, HiChevronRight, HiX, HiMinus, HiAdjustments } from 'react-icons/hi'

// ---------------------------------------------------------------------------
// Shared AsyncSelect styles
// ---------------------------------------------------------------------------
const buildSelectStyles = () => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused
      ? "#3b82f6"
      : document.documentElement.classList.contains("dark")
        ? "#4b5563"
        : "#e5e7eb",
    borderRadius: "0.75rem",
    padding: "0.1rem",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(59, 130, 246, 0.1)" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: document.documentElement.classList.contains("dark")
      ? "#1f2937"
      : "#ffffff",
    borderRadius: "0.75rem",
    overflow: "hidden",
    border: "1px solid",
    borderColor: document.documentElement.classList.contains("dark")
      ? "#374151"
      : "#e5e7eb",
    zIndex: 99999,
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: 220,
    padding: 4,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? document.documentElement.classList.contains("dark")
          ? "#374151"
          : "#f3f4f6"
        : "transparent",
    color: state.isSelected
      ? "#ffffff"
      : document.documentElement.classList.contains("dark")
        ? "#e5e7eb"
        : "#1f2937",
    cursor: "pointer",
    fontSize: "0.875rem",
  }),

  singleValue: (base) => ({
    ...base,
    color: document.documentElement.classList.contains("dark") ? "#e5e7eb" : "#1f2937",
    fontSize: "0.875rem",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
});
// ---------------------------------------------------------------------------
// Premium Table
// ---------------------------------------------------------------------------
const CustomPremiumTable = ({
  loading,
  data,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  onEdit,
  onDelete,
  onOpenAdjust // New prop
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
              <th className="px-6 py-4 text-center">Stok Saat Ini</th>
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
              data.map((row, index) => {
                const rowId = row.ID || row.id

                return (
                  <tr key={rowId} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1.5 rounded-xl font-bold font-mono inline-block min-w-[3.5rem] shadow-sm ${row.stok > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                        {row.stok}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm uppercase font-semibold text-gray-500">
                      {row.satuan?.nama_satuan || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onOpenAdjust(row)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
                          title="Sesuaikan Stok"
                        >
                          <HiAdjustments className="w-5 h-5" />
                        </button>
                        <button onClick={() => onEdit(row)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(row.ID || row.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
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

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------
const defaultItem = () => ({
  master_barang_id: null,   // will store { label, value } object for AsyncSelect
  satuan_id: null,          // same
  stok: 0,
})

const defaultBulkValues = () => ({
  items: [defaultItem()],
})

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
function StokBarang() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Adjustment Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [adjustingItem, setAdjustingItem] = useState(null)
  const [adjustAmount, setAdjustAmount] = useState(1)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [order] = useState("id desc")

  const selectStyles = buildSelectStyles()

  // -------------------------------------------------------------------------
  // Form — useFieldArray for bulk mode; same form used for edit (fields[0])
  // -------------------------------------------------------------------------
  const { register, handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: defaultBulkValues()
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchItems = watch('items') || []

  const handleAdjustStok = async (row, amount) => {
    const adjAmount = parseInt(amount) || 0
    if (adjAmount === 0) return

    const currentStok = parseInt(row.stok) || 0
    const newStok = Math.max(0, currentStok + adjAmount)

    try {
      const payload = {
        id: parseInt(row.ID || row.id),
        master_barang_id: parseInt(row.master_barang_id),
        satuan_id: parseInt(row.satuan_id),
        stok: newStok,
      }
      const res = await fetch(`${BaseUrl}/api/record/barang/`, {
        method: 'PUT',
        headers: UserHelper.jsonHeader(),
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        toast.success(`Stok berhasil ${adjAmount > 0 ? 'ditambah' : 'dikurangi'} ${Math.abs(adjAmount)}`)
        fetchData()
      } else {
        const result = await res.json()
        toast.error(result.message || 'Gagal memperbarui stok')
      }
    } catch {
      toast.error('Kesalahan sistem')
    }
  }

  // Helper to check for duplicate barang-satuan combination in bulk mode
  const isDuplicateCombination = (barangId, satuanId, currentIndex) => {
    if (!barangId || !satuanId) return false
    return watchItems.some((item, idx) => {
      if (idx === currentIndex) return false
      const bId = item.master_barang_id?.value || item.master_barang_id
      const sId = item.satuan_id?.value || item.satuan_id
      return bId === barangId && sId === satuanId
    })
  }

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------
  const fetchData = useCallback(() => {
    setLoading(true)
    fetch(`${BaseUrl}/api/record/barang/cari`, {
      method: 'POST',
      headers: UserHelper.jsonHeader(),
      body: JSON.stringify({
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        order: order,
        search: searchTerm || null
      })
    })
      .then(res => res.json().then(result => ({ ok: res.ok, result })))
      .then(({ ok, result }) => {
        if (ok) {
          setData(result.data || [])
          setTotalItems(result.total || 0)
        } else {
          toast.error(result.message || 'Gagal mengambil data')
        }
      })
      .catch(() => {
        toast.error('Koneksi ke server terputus')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage, itemsPerPage, searchTerm, order])

  const loadBarang = (inputValue, callback) => {
    fetch(`${BaseUrl}/api/master/barang/cari`, {
      method: 'POST',
      headers: UserHelper.jsonHeader(),
      body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "nama_brg asc", tipe_id: 2 })
    })
      .then(res => res.json())
      .then(result => {
        const data = Array.isArray(result) ? result : (result?.data || []);
        callback(data.map(m => ({ label: `${m.nama_brg} (${m.kode_brg})`, value: m.ID })));
      })
      .catch(e => { console.error(e); callback([]); })
  }

  const loadSatuan = (inputValue, callback) => {
    fetch(`${BaseUrl}/api/master/satuan/cari`, {
      method: 'POST',
      headers: UserHelper.jsonHeader(),
      body: JSON.stringify({ search: inputValue, limit: "50", page: "1", order: "nama_satuan asc" })
    })
      .then(res => res.json())
      .then(result => {
        const data = Array.isArray(result) ? result : (result?.data || []);
        callback(data.map(s => ({ label: s.nama_satuan, value: s.ID })));
      })
      .catch(e => { console.error(e); callback([]); })
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchData())
  }, [fetchData])

  // -------------------------------------------------------------------------
  // Modal helpers
  // -------------------------------------------------------------------------
  const openModal = (item = null) => {
    if (item) {
      // Edit mode — single item, prefill fields[0]
      setEditingId(item.ID || item.id)
      reset({
        items: [{
          master_barang_id: item.master_barang_id
            ? { label: item.master_barang?.nama_brg ? `${item.master_barang.nama_brg} (${item.master_barang.kode_brg})` : 'Item Terpilih', value: item.master_barang_id }
            : null,
          satuan_id: item.satuan_id
            ? { label: item.satuan?.nama_satuan || 'Satuan Terpilih', value: item.satuan_id }
            : null,
          stok: item.stok || 0,
        }]
      })
    } else {
      // Add mode — fresh bulk form
      setEditingId(null)
      reset(defaultBulkValues())
    }
    setIsModalOpen(true)
  }

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const onFormSubmit = async (formData) => {
    try {
      if (editingId) {
        // ---- EDIT single item ----
        const row = formData.items[0]
        const payload = {
          id: parseInt(editingId),
          master_barang_id: parseInt(row.master_barang_id?.value || row.master_barang_id) || 0,
          satuan_id: parseInt(row.satuan_id?.value || row.satuan_id) || 0,
          stok: parseInt(row.stok) || 0,
        }
        const res = await fetch(`${BaseUrl}/api/record/barang/`, {
          method: 'PUT',
          headers: UserHelper.jsonHeader(),
          body: JSON.stringify(payload)
        })
        const result = await res.json()
        if (res.ok) {
          toast.success('Data stok diperbarui!')
          setIsModalOpen(false)
          fetchData()
        } else {
          toast.error(result.message || 'Gagal menyimpan data')
        }
      } else {
        // ---- BULK INSERT multiple items ----
        const items = formData.items.map(row => ({
          master_barang_id: parseInt(row.master_barang_id?.value || row.master_barang_id) || 0,
          satuan_id: parseInt(row.satuan_id?.value || row.satuan_id) || 0,
          stok: parseInt(row.stok) || 0,
        }))

        // Final duplicate check
        const seen = new Set()
        for (const it of items) {
          const key = `${it.master_barang_id}-${it.satuan_id}`
          if (seen.has(key)) {
            toast.error('Ada duplikasi barang dan satuan dalam daftar')
            return
          }
          seen.add(key)
        }

        const res = await fetch(`${BaseUrl}/api/record/barang/multiple-product`, {
          method: 'POST',
          headers: UserHelper.jsonHeader(),
          body: JSON.stringify(items)
        })
        const result = await res.json()
        if (res.ok) {
          toast.success(`${items.length} item stok berhasil ditambahkan!`)
          setIsModalOpen(false)
          fetchData()
        } else {
          toast.error(result.message || 'Gagal menyimpan data')
        }
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

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
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
          onOpenAdjust={(item) => {
            setAdjustingItem(item)
            setAdjustAmount(1)
            setIsAdjustModalOpen(true)
          }}
        />

        {/* ================================================================
            Modal Form
        ================================================================ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">

              {/* Header */}
              <header className="px-8 py-5 border-b dark:border-gray-700 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {editingId ? 'Update Stok Barang' : 'Tambah Stok Baru'}
                  </h3>
                  {!editingId && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tambahkan beberapa barang sekaligus dalam satu transaksi.
                    </p>
                  )}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-all">
                  <HiX className="w-6 h-6" />
                </button>
              </header>

              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                  {!editingId && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => append(defaultItem())}
                        className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all shadow-sm"
                        title="Tambah Baris"
                      >
                        <HiPlus className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="relative grid grid-cols-[minmax(0,0.85fr)_220px_120px_44px] items-end gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-700"
                      >
                        <span className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                            Barang (Catalog)
                          </span>
                          <div className="mt-1.5">
                            <Controller
                              name={`items.${index}.master_barang_id`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: f }) => (
                                <AsyncSelect
                                  {...f}
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={loadBarang}
                                  placeholder="Cari Barang..."
                                  styles={selectStyles}
                                  value={f.value}
                                  onChange={(opt) => {
                                    const currentSatuanId = watchItems[index].satuan_id?.value || watchItems[index].satuan_id
                                    if (isDuplicateCombination(opt?.value, currentSatuanId, index)) {
                                      toast.error('Barang dengan satuan ini sudah ada di baris lain')
                                      return
                                    }
                                    f.onChange(opt)
                                  }}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  menuPlacement="auto"
                                  noOptionsMessage={() => "Barang tidak ditemukan"}
                                  loadingMessage={() => "Mencari barang..."}
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                            Satuan
                          </span>
                          <div className="mt-1.5">
                            <Controller
                              name={`items.${index}.satuan_id`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: f }) => (
                                <AsyncSelect
                                  {...f}
                                  defaultOptions={false}
                                  menuPortalTarget={document.body}
                                  loadOptions={loadSatuan}
                                  placeholder="Satuan..."
                                  styles={selectStyles}
                                  value={f.value}
                                  onChange={(opt) => {
                                    const currentBarangId = watchItems[index].master_barang_id?.value || watchItems[index].master_barang_id
                                    if (isDuplicateCombination(currentBarangId, opt?.value, index)) {
                                      toast.error('Barang dengan satuan ini sudah ada di baris lain')
                                      return
                                    }
                                    f.onChange(opt)
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-700 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                            Stok
                          </span>
                          <div className={`flex items-center mt-1.5 gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-1 shadow-sm ${editingId ? 'bg-gray-100 dark:bg-gray-900/50' : ''}`}>
                            {!editingId && (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentVal = parseInt(watchItems[index]?.stok) || 0
                                  setValue(`items.${index}.stok`, Math.max(0, currentVal - 1))
                                }}
                                className="p-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 transition-all"
                              >
                                <HiMinus className="w-4 h-4" />
                              </button>
                            )}
                            <input
                              {...register(`items.${index}.stok`, { required: true, min: 0 })}
                              type="number"
                              placeholder="0"
                              min={0}
                              readOnly={!!editingId}
                              className={`w-full text-center bg-transparent border-none focus:ring-0 font-mono font-bold text-sm ${editingId ? 'cursor-not-allowed opacity-70' : ''}`}
                            />
                            {!editingId && (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentVal = parseInt(watchItems[index]?.stok) || 0
                                  setValue(`items.${index}.stok`, currentVal + 1)
                                }}
                                className="p-1.5 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-100 transition-all"
                              >
                                <HiPlus className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                        </div>

                        <div className="flex justify-center pb-1">
                          {!editingId && fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                              title="Hapus baris ini"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <footer className="px-8 py-5 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t dark:border-gray-700 shrink-0">
                  <span className="text-xs text-gray-400">
                    {!editingId && `${fields.length} item akan disimpan`}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
                    >
                      {editingId ? 'Simpan Perubahan' : `Simpan ${fields.length > 1 ? `(${fields.length} Item)` : ''}`}
                    </button>
                  </div>
                </footer>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================
            Adjustment Modal
        ================================================================ */}
        {isAdjustModalOpen && adjustingItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
              <header className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Penyesuaian Stok</h3>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{adjustingItem.master_barang?.nama_brg}</p>
                </div>
                <button onClick={() => setIsAdjustModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 rounded-full">
                  <HiX className="w-5 h-5" />
                </button>
              </header>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                  <span className="text-sm text-gray-500">Stok Saat Ini</span>
                  <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">{adjustingItem.stok}</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest text-center">Nominal Penyesuaian</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAdjustAmount(Math.max(1, adjustAmount - 1))}
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-gray-200 transition-all shadow-sm"
                    >
                      <HiMinus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="flex-1 text-center text-2xl font-bold font-mono bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-3 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                      onClick={() => setAdjustAmount(adjustAmount + 1)}
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-gray-200 transition-all shadow-sm"
                    >
                      <HiPlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={async () => {
                      await handleAdjustStok(adjustingItem, -adjustAmount)
                      setIsAdjustModalOpen(false)
                    }}
                    className="flex flex-col items-center gap-1 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-100 dark:border-red-900/30 group"
                  >
                    <HiMinus className="w-6 h-6 group-active:scale-90 transition-transform" />
                    <span className="text-xs font-bold uppercase">Kurangi Stok</span>
                  </button>
                  <button
                    onClick={async () => {
                      await handleAdjustStok(adjustingItem, adjustAmount)
                      setIsAdjustModalOpen(false)
                    }}
                    className="flex flex-col items-center gap-1 py-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all border border-green-100 dark:border-green-900/30 group"
                  >
                    <HiPlus className="w-6 h-6 group-active:scale-90 transition-transform" />
                    <span className="text-xs font-bold uppercase">Tambah Stok</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default StokBarang
