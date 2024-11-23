import React from 'react'

const SSchedule = () => {
  const shifts = ["morning", "day", "night"];
  const shiftTime = (shift) => {
    if (shift === "morning") {
      return "05:00 AM to 01:00 PM";
    } else if (shift === "day") {
      return "01:00 PM to 09:00 PM";
    } else if (shift === "night") {
      return "09:00 PM to 05:00 AM";
    } else {
      return "Invalid shift"; // Handle invalid inputs
    }
  };
  const attendance=[
    { date:"24/11/24", current_attendance:"Absent"},
    { date:"23/11/24", current_attendance:"Present"},
    { date:"22/11/24", current_attendance:"Present"},
    { date:"21/11/24", current_attendance:"Present"},
    { date:"20/11/24", current_attendance:"Present"},
    { date:"19/11/24", current_attendance:"Present"},
    { date:"18/11/24", current_attendance:"Absent"},
    { date:"17/11/24", current_attendance:"Present"},
    { date:"16/11/24", current_attendance:"Present"},
    { date:"15/11/24", current_attendance:"Present"},
    { date:"14/11/24", current_attendance:"Present"},
    { date:"13/11/24", current_attendance:"Present"},
    { date:"12/11/24", current_attendance:"Present"},
    { date:"11/11/24", current_attendance:"Present"},
  ]
  return (
    <section className=" h-screen py-2 mx-4 px-0 font-Montserrat ">
      <h2 className="text-[#252941] text-3xl  my-3 pl-8 ml-5 font-semibold">Schedule Status</h2>
      <div className="grid grid-cols-1 h-full xl:grid-cols-[40%,35%] gap-6 p-3 ">
        <div className="space-y-5 gap-4">
          <div className="bg-white w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-left">Shift Schedule</h2>
            <div className='text-md text-[#47518C] font-semibold mb-2'>
              <p className='capitalize'>{shifts[0]}</p>
              <p className=''>Time: {shiftTime(shifts[0])}</p>
            </div>
          </div>

          <div className="bg-white w-full h-[80%] pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-left">Attendance</h2>
            <div className='h-[90%] mb-4 overflow-y-scroll'>
            <table className="w-[96%]   px-1 mx-auto border border-[#dcdcdc] rounded-2xl shadow  ">
              {/* Table Headers */}
              <thead>
                <tr className="bg-[#3F4870] text-[#E6EEF9] rounded-xl">
                  
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Attendance</th>
                  
                </tr>
              </thead>


              <tbody>
                {attendance.map((member,index) => (
                  <tr
                    // key={member.date}
                    className={`px-4 py-2 ${index % 2 === 0 ? 'bg-[#F1F6FC]' : 'bg-[#DEE8FF]'
                      }`}
                  >
                    <td className="px-4 py-2 text-center">{member.date}</td>
                    
                    <td className="px-4 py-2 text-center">
                      <button
                        className={`px-4 py-1 rounded-full ${member.current_attendance === 'Present'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                          }`}
                        
                      >
                        {member.current_attendance}
                      </button>
                    </td>
                   
                  </tr>
                 ))}
                 </tbody>
               </table>
               </div>
          </div>
        </div>
        <div className='space-y-5 gap-4'>
          
        </div>
      </div>
    </section>
  )
}

export default SSchedule