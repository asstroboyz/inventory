import React from 'react'
import Layout from '../layout/Layout'

function Forbidden() {
  return (
    <Layout>
      <div className="container flex flex-col items-center px-6 mx-auto">
        <svg
          className="w-12 h-12 mt-8 text-purple-200"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.366zM7.5 14.435A6 6 0 0015.866 6.07L7.5 14.435zM10 18a8 8 0 100-16 8 8 0 000 16z"
            clipRule="evenodd"
          ></path>
        </svg>
        <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">
          404
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Page not found. Check the address or{' '}
          <a
            className="text-purple-600 hover:underline dark:text-purple-300"
            href="../index.html"
          >
            go back
          </a>
          .
        </p>
      </div>
    </Layout>
  )
}

export default Forbidden
