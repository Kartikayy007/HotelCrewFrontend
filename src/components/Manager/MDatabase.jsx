import React from 'react'
import DataBase from '../../components/reusable components/Database';
const MDatabase = () => {
  // const [selected, setSelected] = useState('staff');
  return (
    <div>
    {/* // <div className=' h-screen p-2 mr-4 font-Montserrat'> */}
       {/* <h2 className="text-[#252941] text-2xl pl-3 mt-4 font-semibold">Database</h2>
      <div className='flex mt-4 gap-4 pl-2'>
      <button
        className={`pl-2 pr-2 pt-1 pb-1 w-20 rounded-xl ${selected === 'staff' ? 'bg-[#8094d4] text-white' : 'bg-white'}`}
        onClick={() => setSelected('staff')}
      >
        Staff
      </button>
      <button
        className={`pl-2 pr-2 pt-1 pb-1 wt-20 rounded-xl ${selected === 'customer' ? 'bg-[#8094d4] text-white' : 'bg-white'}`}
        onClick={() => setSelected('customer')}
      >
        Customer
      </button>
    </div>
    <div className='flex mt-4 gap-4 pl-2'>
      
    </div> */}
    <DataBase />
    </div>
  )
}

export default MDatabase