import React from 'react';

interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent';
}

const Schedule: React.FC = () => {
  const attendanceData: AttendanceRecord[] = [
    { date: '24/11/24', status: 'Absent' },
    { date: '23/11/24', status: 'Present' },
    { date: '22/11/24', status: 'Absent' },
    { date: '21/11/24', status: 'Present' },
    { date: '20/11/24', status: 'Present' },
    { date: '19/11/24', status: 'Present' },
    { date: '18/11/24', status: 'Present' },
    { date: '17/11/24', status: 'Present' },
    { date: '16/11/24', status: 'Present' }
  ];

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">Schedule Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">

        <div className='flex flex-col gap-4'>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Shift Schedule</h2>
            <div className="space-y-2">
              <p className="text-[#47518C] font-semibold">Day Shift</p>
              <p className="text-[#47518C] font-semibold ">Time: 12:00 A.M. - 12:00 P.M.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Attendance</h2>
              <select className="w-32 p-2 border rounded">
                <option value="">Date</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#3F4870] text-white">
                    <th className="p-3 text-left rounded-tl-lg">Date</th>
                    <th className="p-3 text-left rounded-tr-lg">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="p-3">{record.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${record.status === 'Present'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                            }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Leave Request</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded-xl bg-[#D2E0F3]"
            />
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full p-2 border rounded-xl bg-[#D2E0F3]">
                <option value="">Start Date</option>
              </select>
              <select className="w-full p-2 border rounded-xl bg-[#D2E0F3]">
                <option value="">End Date</option>
              </select>
            </div>
            <textarea
              placeholder="Leave Description"
              className="w-full h-[55.6vh] p-2 border rounded-xl bg-[#D2E0F3] resize-none"
              rows={4}
            />
            <button className="w-full py-2 bg-[#4F5B93] hover:bg-[#3F497A] text-white rounded">
              Request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;