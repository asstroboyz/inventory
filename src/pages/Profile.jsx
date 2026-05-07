import { useState } from 'react'
import Layout from '../layout/Layout'
import { UserHelper } from '../helper/user'
import { BaseUrl } from '../helper/api'
import toast from 'react-hot-toast'
import {
  HiCamera,
  HiDocumentText,
  HiEye,
  HiDownload,
  HiX,
  HiPlus,
  HiCheckCircle,
  HiCloudUpload,
  HiUserCircle,
  HiIdentification
} from 'react-icons/hi'

function Profile() {
  const user = UserHelper.getUser()
  const token = UserHelper.getToken()

  // Tab State
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'berkas'

  // --- Profile Logic ---
  const [formData, setFormData] = useState({
    username: user?.username || '',
    nama_depan: user?.nama_depan || '',
    nama_belakang: user?.nama_belakang || '',
    email: user?.email || '',
    phone: user?.phone || '',
    status: user?.status || 'active',
  })

  const [pic, setPic] = useState(null)
  const [picPreview, setPicPreview] = useState(
    user?.berkas?.find(b => b.jenis === 'foto_profil')?.path
      ? `${BaseUrl}${user.berkas.find(b => b.jenis === 'foto_profil').path}`
      : 'https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82'
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPic(file)
      setPicPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('id', user.ID || user.id || 0)
      data.append('username', formData.username)
      data.append('nama_depan', formData.nama_depan)
      data.append('nama_belakang', formData.nama_belakang)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('status', formData.status)

      const res = await fetch(`${BaseUrl}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Authorization': token },
        body: data,
      })
      const result = await res.json()
      if (res.ok) {
        UserHelper.setUser(result.data)
        toast.success('Profil berhasil diperbarui!')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error(error.message || 'Gagal update profil')
    } finally {
      setLoading(false)
    }
  }

  // --- Berkas Logic ---
  const [docs, setDocs] = useState({
    lamaran: user?.berkas?.find(b => b.jenis === 'lamaran')?.path || null,
    ijazah: user?.berkas?.find(b => b.jenis === 'ijazah')?.path || null,
    transkrip: user?.berkas?.find(b => b.jenis === 'transkrip')?.path || null,
  })

  const [newDocs, setNewDocs] = useState({
    lamaran: null,
    ijazah: null,
    transkrip: null,
  })

  const [sertifikats, setSertifikats] = useState(
    user?.berkas?.filter(b => b.jenis === 'sertifikat').map(b => b.path) || []
  )
  const [newSertifikats, setNewSertifikats] = useState([])

  const handleDocChange = (e, field) => {
    const file = e.target.files[0]
    if (file) setNewDocs({ ...newDocs, [field]: file })
  }

  const handleSertifikatChange = (e) => {
    const files = Array.from(e.target.files)
    setNewSertifikats([...newSertifikats, ...files])
  }

  const removeNewSertifikat = (index) => {
    const updated = [...newSertifikats]
    updated.splice(index, 1)
    setNewSertifikats(updated)
  }

  const handleSaveBerkas = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      if (pic) data.append('pic', pic)
      if (newDocs.lamaran) data.append('lamaran', newDocs.lamaran)
      if (newDocs.ijazah) data.append('ijazah', newDocs.ijazah)
      if (newDocs.transkrip) data.append('transkrip', newDocs.transkrip)
      newSertifikats.forEach((file) => data.append('sertifikat[]', file))

      const res = await fetch(`${BaseUrl}/api/berkas/upload`, {
        method: 'POST',
        headers: { 'Authorization': token },
        body: data,
      })
      const result = await res.json()
      if (res.ok) {
        UserHelper.setUser(result.data)
        const updated = result.data.berkas || []
        setDocs({
          lamaran: updated.find(b => b.jenis === 'lamaran')?.path || null,
          ijazah: updated.find(b => b.jenis === 'ijazah')?.path || null,
          transkrip: updated.find(b => b.jenis === 'transkrip')?.path || null,
        })
        setSertifikats(updated.filter(b => b.jenis === 'sertifikat').map(b => b.path))
        setNewDocs({ lamaran: null, ijazah: null, transkrip: null })
        setNewSertifikats([])
        setPic(null)
        toast.success('Berkas berhasil diupload!')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error(error.message || 'Gagal upload berkas')
    } finally {
      setLoading(false)
    }
  }

  const [loading, setLoading] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  return (
    <Layout>
      <div className="container px-6 mx-auto grid pb-8">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-3">
          Pengaturan Akun
        </h2>

        {/* Tab Navigation */}
        <div className="flex p-1 mb-8 space-x-1 bg-purple-100 rounded-xl dark:bg-gray-800 max-w-md">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ${activeTab === 'profile'
              ? 'bg-white text-purple-700 shadow dark:bg-purple-600 dark:text-white'
              : 'text-purple-500 hover:text-purple-700 hover:bg-white/[0.12] dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            <HiUserCircle className="w-5 h-5 mr-2" /> Informasi Akun
          </button>
          <button
            onClick={() => setActiveTab('berkas')}
            className={`flex items-center justify-center w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ${activeTab === 'berkas'
              ? 'bg-white text-purple-700 shadow dark:bg-purple-600 dark:text-white'
              : 'text-purple-500 hover:text-purple-700 hover:bg-white/[0.12] dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            <HiIdentification className="w-5 h-5 mr-2" /> Berkas
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="grid gap-6 md:grid-cols-3">
              {/* Profile Photo Section */}
              <div className="md:col-span-1">
                <div className="px-6 py-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800 text-center border border-gray-100 dark:border-gray-700">
                  <div className="relative inline-block mb-6 group">
                    <img className="w-40 h-40 rounded-full object-cover border-4 border-purple-500 shadow-xl mx-auto transition-transform group-hover:scale-105" src={picPreview} alt="Profile" />
                    <label className="absolute bottom-1 right-1 p-3 bg-purple-600 rounded-full text-white cursor-pointer hover:bg-purple-700 shadow-lg transition-all active:scale-90">
                      <HiCamera className="w-6 h-6" />
                      <input type="file" className="hidden" accept="image/*" onChange={handlePicChange} />
                    </label>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{formData.username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>

                  {pic && (
                    <p className="mt-4 text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 py-1 px-3 rounded-full inline-block">
                      Foto baru dipilih. Simpan di tab Berkas.
                    </p>
                  )}
                </div>
              </div>

              {/* Account Info Form */}
              <div className="md:col-span-2 space-y-6">
                <div className="px-6 py-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <h4 className="mb-6 text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-4 dark:border-gray-700">Detail Profil</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-semibold">username</span>
                      <input name="username" className="form-input mt-2" value={formData.username} onChange={handleInputChange} required />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-semibold">No. Telepon</span>
                      <input name="phone" className="form-input mt-2" value={formData.phone} onChange={handleInputChange} />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-semibold">Nama Depan</span>
                      <input name="nama_depan" className="form-input mt-2" value={formData.nama_depan} onChange={handleInputChange} />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400 font-semibold">Nama Belakang</span>
                      <input name="nama_belakang" className="form-input mt-2" value={formData.nama_belakang} onChange={handleInputChange} />
                    </label>
                    <label className="block text-sm md:col-span-2">
                      <span className="text-gray-700 dark:text-gray-400 font-semibold">Email</span>
                      <input name="email" type="email" className="form-input mt-2" value={formData.email} onChange={handleInputChange} required />
                    </label>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400">
                      {loading ? 'Menyimpan...' : 'Update Profil'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveBerkas} className="space-y-6">
              <div className="px-8 py-10 bg-white rounded-2xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-8 border-b pb-6 dark:border-gray-700">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Berkas & Dokumen </h4>
                    <p className="text-sm text-gray-500 mt-1">Upload dan kelola dokumen kepegawaian Anda dalam format PDF.</p>
                  </div>
                  <HiDocumentText className="w-10 h-10 text-purple-500 opacity-20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DocumentField title="Surat Lamaran" fieldName="lamaran" currentFile={docs.lamaran} newFile={newDocs.lamaran} onChange={handleDocChange} onPreview={(url) => setPreviewFile({ url, title: 'Surat Lamaran' })} />
                  <DocumentField title="Ijazah Terakhir" fieldName="ijazah" currentFile={docs.ijazah} newFile={newDocs.ijazah} onChange={handleDocChange} onPreview={(url) => setPreviewFile({ url, title: 'Ijazah Terakhir' })} />
                  <DocumentField title="Transkrip Nilai" fieldName="transkrip" currentFile={docs.transkrip} newFile={newDocs.transkrip} onChange={handleDocChange} onPreview={(url) => setPreviewFile({ url, title: 'Transkrip Nilai' })} />

                  <div className="lg:col-span-2 space-y-4">
                    <span className="block text-sm font-bold text-gray-700 dark:text-gray-400">Sertifikat Pendukung</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sertifikats.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
                          <button type="button" onClick={() => setPreviewFile({ url: `${BaseUrl}${s}`, title: `Sertifikat ${idx + 1}` })} className="text-xs font-semibold text-blue-700 dark:text-blue-300 truncate hover:underline flex-1">
                            Sertifikat {idx + 1}
                          </button>
                          <HiEye className="w-5 h-5 text-blue-500 cursor-pointer ml-2 hover:scale-110 transition-transform" onClick={() => setPreviewFile({ url: `${BaseUrl}${s}`, title: `Sertifikat ${idx + 1}` })} />
                        </div>
                      ))}
                      {newSertifikats.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800">
                          <span className="text-xs font-semibold text-green-700 dark:text-green-300 truncate">{f.name}</span>
                          <button type="button" onClick={() => removeNewSertifikat(idx)} className="text-red-500 hover:text-red-700 ml-2">
                            <HiX className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <label className="flex items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:border-gray-600 transition-all border-gray-300">
                        <HiPlus className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Tambah Sertifikat</span>
                        <input type="file" className="hidden" multiple accept=".pdf" onChange={handleSertifikatChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="text-sm text-gray-500">
                    Pastikan semua file dalam format <span className="font-bold text-purple-600">PDF</span> dan maksimal <span className="font-bold text-purple-600">2MB</span>.
                  </div>
                  <button type="submit" disabled={loading} className="px-10 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400">
                    {loading ? 'Mengupload...' : 'Upload & Simpan Berkas'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* PDF Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden dark:bg-gray-800 flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-8 py-5 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{previewFile.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Mode Pratinjau Dokumen</p>
                </div>
                <div className="flex items-center space-x-3">
                  <a href={previewFile.url} download className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-purple-600 hover:text-white transition-all shadow-sm" title="Download">
                    <HiDownload className="w-6 h-6" />
                  </a>
                  <button onClick={() => setPreviewFile(null)} className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Close">
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 relative">
                <iframe src={previewFile.url} className="w-full h-full border-none" title="PDF Preview" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function DocumentField({ title, fieldName, currentFile, newFile, onChange, onPreview }) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-bold text-gray-700 dark:text-gray-400">{title}</span>
      {newFile ? (
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="flex items-center overflow-hidden">
            <HiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-xs font-bold text-green-700 dark:text-green-300 truncate">{newFile.name}</span>
          </div>
          <span className="text-[10px] bg-green-500 text-white px-2.5 py-1 rounded-lg uppercase font-black tracking-wider ml-3">Ready</span>
        </div>
      ) : currentFile ? (
        <div className="flex items-center justify-between p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-sm transition-all hover:border-purple-300">
          <button type="button" onClick={() => onPreview(`${BaseUrl}${currentFile}`)} className="text-xs font-bold text-purple-700 dark:text-purple-300 truncate hover:underline text-left flex-1">
            {currentFile.split('/').pop()}
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <button type="button" onClick={() => onPreview(`${BaseUrl}${currentFile}`)} className="p-2 bg-white dark:bg-gray-800 rounded-xl text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm">
              <HiEye className="w-4 h-4" />
            </button>
            <HiCheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all">
          <div className="flex flex-col items-center justify-center">
            <HiCloudUpload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-purple-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Pilih Berkas PDF</p>
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={(e) => onChange(e, fieldName)} />
        </label>
      )}
    </div>
  )
}

export default Profile
