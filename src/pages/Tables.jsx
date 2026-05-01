import Layout from '../layout/Layout'

function Tables() {
  const clients = [
    { name: 'Hans Burger', job: '10x Developer', amount: '$ 863.45', status: 'Approved', date: '6/10/2020', avatar: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ' },
    { name: 'Jolina Angelie', job: 'Unemployed', amount: '$ 369.95', status: 'Pending', date: '6/10/2020', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&facepad=3&fit=facearea&s=707b9c33066bf8808c934c8ab394dff6' },
    { name: 'Sarah Curry', job: 'Designer', amount: '$ 86.00', status: 'Denied', date: '6/10/2020', avatar: 'https://images.unsplash.com/photo-1551069613-1904dbdcda11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ' },
    { name: 'Rulia Joberts', job: 'Actress', amount: '$ 1276.45', status: 'Approved', date: '6/10/2020', avatar: 'https://images.unsplash.com/photo-1551006917-3b4c078c47c9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ' },
    { name: 'Wenzel Dashington', job: 'Actor', amount: '$ 863.45', status: 'Expired', date: '6/10/2020', avatar: 'https://images.unsplash.com/photo-1546456073-6712f79251bb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ' },
  ]

  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Tables
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

        <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Table with avatars
        </h4>
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {clients.map((client, i) => (
                  <tr key={i} className="text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={client.avatar}
                            alt=""
                            loading="lazy"
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div>
                          <p className="font-semibold">{client.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{client.job}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{client.amount}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${client.status === 'Approved' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' :
                          client.status === 'Pending' ? 'text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600' :
                            client.status === 'Denied' ? 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700' :
                              'text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'
                        }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{client.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Tables
