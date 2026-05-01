import React from 'react'
import Layout from '../layout/Layout'

function Blank() {
  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Blank Page
        </h2>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          Content goes here
        </div>
      </div>
    </Layout>
  )
}

export default Blank
