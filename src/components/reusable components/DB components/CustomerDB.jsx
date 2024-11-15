import React from 'react'

function CustomerDB() {
  return (
    <section>
      <div className="max-h-[calc(100vh-200px)] overflow-auto shadow-md">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#252941] text-white">
              <th className="py-3 px-4 text-left font-semibold rounded-none">
                PROFILE
              </th>
              <th className="py-3 px-4 text-left font-semibold">
                Contact Number
              </th>
              <th className="py-3 px-4 text-left font-semibold">E-mail</th>
              <th className="py-3 px-4 text-left font-semibold">Room</th>
              <th className="py-3 px-4 text-left font-semibold">Check-In</th>
              <th className="py-3 px-4 text-left font-semibold">Check-Out</th>
              <th className="py-3 px-4 text-left font-semibold rounded-tr-lg">
                VIP Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5,6,7,8,9].map((item) => (
              <tr key={item} className="bg-gray-100 text-gray-900">
                <td className="py-3 px-4 text-left font-semibold rounded-none">
                  <div className="flex items-center text-sm">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <img
                        className="shadow-md rounded-full w-full h-full object-cover"
                        src="https://randomuser.me/api/portraits"
                        alt="Customer profile"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Jane Smith
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-left font-semibold">
                  9876543210
                </td>
                <td className="py-3 px-4 text-left font-semibold">
                  jane.smith@example.com
                </td>
                <td className="py-3 px-4 text-left font-semibold">
                  301
                </td>
                <td className="py-3 px-4 text-left font-semibold">
                  2024-03-20
                </td>
                <td className="py-3 px-4 text-left font-semibold">
                  2024-03-25
                </td>
                <td className="py-3 px-4 text-left font-semibold">
                  Gold
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CustomerDB