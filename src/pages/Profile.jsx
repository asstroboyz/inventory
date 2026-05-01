import React, { useState } from 'react'
import Layout from '../layout/Layout'

function Profile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    address: 'Jl. Merdeka No. 123, Jakarta',
    dob: '1990-01-01',
    phone: '081234567890',
  })

  const [files, setFiles] = useState({
    ijazah: null,
    lamaran: 'surat_lamaran_kerja.pdf',
    kinerja: null,
  })

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      setFiles({ ...files, [field]: file.name })
    }
  }

  const handleDeleteFile = (field) => {
    setFiles({ ...files, [field]: null })
  }

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          User Profile
        </h2>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Personal Info */}
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Personal Information
            </h4>
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Full Name</span>
                <input
                  className="form-input mt-1"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Address</span>
                <textarea
                  className="form-input mt-1"
                  rows="3"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                ></textarea>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Date of Birth</span>
                  <input
                    type="date"
                    className="form-input mt-1"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Phone Number</span>
                  <input
                    className="form-input mt-1"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </label>
              </div>
              <button className="btn-primary mt-4">Save Changes</button>
            </div>
          </div>

          {/* Documents */}
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Documents & Files
            </h4>
            <div className="space-y-6">
              {/* Ijazah */}
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Ijazah Terakhir
                </span>
                {files.ijazah ? (
                  <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <span className="text-sm text-purple-700 dark:text-purple-300 truncate mr-2">
                      {files.ijazah}
                    </span>
                    <button
                      onClick={() => handleDeleteFile('ijazah')}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'ijazah')} />
                    </label>
                  </div>
                )}
              </div>

              {/* Surat Lamaran */}
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Surat Lamaran Kerja
                </span>
                {files.lamaran ? (
                  <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <span className="text-sm text-purple-700 dark:text-purple-300 truncate mr-2">
                      {files.lamaran}
                    </span>
                    <button
                      onClick={() => handleDeleteFile('lamaran')}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'lamaran')} />
                    </label>
                  </div>
                )}
              </div>

              {/* Nilai Kinerja */}
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Nilai Kinerja Tahunan
                </span>
                {files.kinerja ? (
                  <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <span className="text-sm text-purple-700 dark:text-purple-300 truncate mr-2">
                      {files.kinerja}
                    </span>
                    <button
                      onClick={() => handleDeleteFile('kinerja')}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'kinerja')} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
