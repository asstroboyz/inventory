import React from 'react'
import Layout from '../layout/Layout'

function Forms() {
  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Forms
        </h2>
        
        {/* CTA */}
        <div className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span>Star this project on GitHub</span>
          </div>
          <span>View more &rarr;</span>
        </div>

        {/* General elements */}
        <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Elements
        </h4>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">Name</span>
            <input
              className="form-input mt-1"
              placeholder="Jane Doe"
            />
          </label>

          <div className="mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
              Account Type
            </span>
            <div className="mt-2">
              <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  className="text-purple-600 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                  name="accountType"
                  value="personal"
                />
                <span className="ml-2">Personal</span>
              </label>
              <label className="inline-flex items-center ml-6 text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  className="text-purple-600 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                  name="accountType"
                  value="business"
                />
                <span className="ml-2">Business</span>
              </label>
            </div>
          </div>

          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
              Requested Limit
            </span>
            <select className="form-input mt-1">
              <option>$1,000</option>
              <option>$5,000</option>
              <option>$10,000</option>
              <option>$25,000</option>
            </select>
          </label>

          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
              Message
            </span>
            <textarea
              className="form-input mt-1"
              rows="3"
              placeholder="Enter some long form content."
            ></textarea>
          </label>

          <div className="flex mt-6 text-sm">
            <label className="flex items-center dark:text-gray-400">
              <input
                type="checkbox"
                className="text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2">
                I agree to the
                <span className="underline ml-1">privacy policy</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Forms
