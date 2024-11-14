import React from 'react'

function AdminScheduleStatus() {
  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll">
      <h1 className="text-3xl font-semibold p-4 sm:p-8 lg:ml-8 ml-12"></h1>

      <div className="flex flex-col lg:flex-row justify-around mx-4 sm:mx-8">

        <div className="flex flex-col space-y-6 w-full lg:w-4/6 mb-6 lg:mb-9">
          <div className="bg-white rounded-lg shadow h-80 w-full"></div>
          <div className="bg-white rounded-lg shadow h-80 w-full"></div>
          <div className="bg-white rounded-lg shadow h-80 w-full"></div>
        </div>

        <div className="flex flex-col space-y-6 w-full lg:w-[30%] mt-6 lg:mt-0">
          <div className="bg-white rounded-lg shadow h-[26rem] w-full"></div>
          <div className="bg-white rounded-lg shadow h-56 w-full"></div>
          <div className="bg-white rounded-lg shadow h-80 w-full"></div>
        </div>

      </div>
    </section>
  )
}

export default AdminScheduleStatus
