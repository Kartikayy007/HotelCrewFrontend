import React from 'react'

function AdminDataBase() {
  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
    <div className='flex items-center'>
      <h1 className="text-3xl font-semibold p-4 sm:p-8 lg:ml-8 ml-12">
        Database
      </h1>
      <button className="text-xl font-semibold w-32 h-12 rounded-full text-white bg-[#6675C5]">
          Staff
      </button>
      <button className="text-xl font-semibold w-32 h-12 rounded-full text-white bg-[#6675C5]">
          Customer
      </button>
    </div>
    
    </section>
  )
}

export default AdminDataBase
