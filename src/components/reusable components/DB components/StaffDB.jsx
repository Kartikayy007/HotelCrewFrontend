import React from "react";

function StaffDB() {
  return (
    <section>
      <div className="max-h-[calc(100vh-200px)] overflow-auto shadow-md">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#252941] text-white">
              <th className="py-3 px-4 text-left font-semibold ">
                PROFILE
              </th>
              <th className="py-3 px-4 text-left font-semibold">
                Contact Number
              </th>
              <th className="py-3 px-4 text-left font-semibold">Role</th>
              <th className="py-3 px-4 text-left font-semibold">E-mail</th>
              <th className="py-3 px-4 text-left font-semibold">Shift</th>
              <th className="py-3 px-4 text-left font-semibold rounded-tr-lg">Performance</th>
            </tr>
          </thead>
          <tbody className="overflow-x-scroll">
            <tr className="bg-gray-100 text-gray-900">
              <td className="py-3 px-4 text-left font-semibold rounded-none">
                <div className="flex items-center text-sm">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src="https://randomuser.me/api/portraits" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      John Doe
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-semibold">
                1234567890
              </td>
              <td className="py-3 px-4 text-left font-semibold">Manager</td>
              <td className="py-3 px-4 text-left font-semibold">
                john.doe@example.com
              </td>
              <td className="py-3 px-4 text-left font-semibold">Morning</td>
              <td className="py-3 px-4 text-left font-semibold">Excellent</td>
            </tr>
            
            <tr className="bg-gray-100 text-gray-900">
              <td className="py-3 px-4 text-left font-semibold rounded-none">
                <div className="flex items-center text-sm">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src="https://randomuser.me/api/portraits" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      John Doe
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-semibold">
                1234567890
              </td>
              <td className="py-3 px-4 text-left font-semibold">Manager</td>
              <td className="py-3 px-4 text-left font-semibold">
                john.doe@example.com
              </td>
              <td className="py-3 px-4 text-left font-semibold">Morning</td>
              <td className="py-3 px-4 text-left font-semibold">Excellent</td>
            </tr>
            <tr className="bg-gray-100 text-gray-900">
              <td className="py-3 px-4 text-left font-semibold rounded-none">
                <div className="flex items-center text-sm">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src="https://randomuser.me/api/portraits" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      John Doe
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-semibold">
                1234567890
              </td>
              <td className="py-3 px-4 text-left font-semibold">Manager</td>
              <td className="py-3 px-4 text-left font-semibold">
                john.doe@example.com
              </td>
              <td className="py-3 px-4 text-left font-semibold">Morning</td>
              <td className="py-3 px-4 text-left font-semibold">Excellent</td>
            </tr>
            <tr className="bg-gray-100 text-gray-900">
              <td className="py-3 px-4 text-left font-semibold rounded-none">
                <div className="flex items-center text-sm">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src="https://randomuser.me/api/portraits" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      John Doe
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-semibold">
                1234567890
              </td>
              <td className="py-3 px-4 text-left font-semibold">Manager</td>
              <td className="py-3 px-4 text-left font-semibold">
                john.doe@example.com
              </td>
              <td className="py-3 px-4 text-left font-semibold">Morning</td>
              <td className="py-3 px-4 text-left font-semibold">Excellent</td>
            </tr>
            <tr className="bg-gray-100 text-gray-900">
              <td className="py-3 px-4 text-left font-semibold rounded-none">
                <div className="flex items-center text-sm">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src="https://randomuser.me/api/portraits" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      John Doe
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-semibold">
                1234567890
              </td>
              <td className="py-3 px-4 text-left font-semibold">Manager</td>
              <td className="py-3 px-4 text-left font-semibold">
                john.doe@example.com
              </td>
              <td className="py-3 px-4 text-left font-semibold">Morning</td>
              <td className="py-3 px-4 text-left font-semibold">Excellent</td>
            </tr>
            <tr className="bg-gray-100 text-gray-900">
              <td className="py-3 px-4 text-left font-semibold rounded-none">
                <div className="flex items-center text-sm">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src="https://randomuser.me/api/portraits" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      John Doe
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-semibold">
                1234567890
              </td>
              <td className="py-3 px-4 text-left font-semibold">Manager</td>
              <td className="py-3 px-4 text-left font-semibold">
                john.doe@example.com
              </td>
              <td className="py-3 px-4 text-left font-semibold">Morning</td>
              <td className="py-3 px-4 text-left font-semibold">Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
export default StaffDB;
