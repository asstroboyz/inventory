import React from 'react'
import Layout from '../layout/Layout'

function ChangePassword() {
  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Change Password
        </h2>

        <div className="max-w-xl px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <form className="space-y-4">
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400">Current Password</span>
              <input
                type="password"
                className="form-input mt-1"
                placeholder="••••••••"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400">New Password</span>
              <input
                type="password"
                className="form-input mt-1"
                placeholder="••••••••"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700 dark:text-gray-400">Confirm New Password</span>
              <input
                type="password"
                className="form-input mt-1"
                placeholder="••••••••"
              />
            </label>
            
            <div className="pt-4">
              <button type="submit" className="btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ChangePassword
