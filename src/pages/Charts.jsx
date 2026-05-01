import Layout from '../layout/Layout'

function Charts() {
  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Charts
        </h2>
        
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Revenue
            </h4>
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
               <span className="text-gray-500 dark:text-gray-400 font-medium">Chart Placeholder (Revenue)</span>
            </div>
          </div>
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Traffic
            </h4>
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
               <span className="text-gray-500 dark:text-gray-400 font-medium">Chart Placeholder (Traffic)</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Charts
