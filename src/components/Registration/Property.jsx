import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const Property = () => {
  const [roomTypes, setRoomTypes] = useState([
    { type: '', count: '' },
    { type: '', count: '' },
    { type: '', count: '' }
  ]);

  const handleAddRoomType = () => {
    setRoomTypes([...roomTypes, { type: '', count: '' }]);
  };

  const handleDeleteRoomType = (index) => {
    const newRoomTypes = roomTypes.filter((_, i) => i !== index);
    setRoomTypes(newRoomTypes);
  };

  const handleRoomTypeChange = (index, field, value) => {
    const newRoomTypes = [...roomTypes];
    newRoomTypes[index][field] = value;
    setRoomTypes(newRoomTypes);
  };

  return (
    <section className="min-h-screen bg-white flex items-center">
      <div className="flex justify-center items-center gap-9 ml-20">
        <form className="space-y-7 relative"> 
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[550]">Property Details</h1>
          </div>

          <div>
            <label
              htmlFor="hotel-name"
              className="block text-sm font-sans font-[450]"
            >
              Number of Rooms
            </label>
            <input
              type="text"
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          <div className="h-40"> 
            <div className="flex justify-between mb-2">
              <label
                htmlFor="legal-business-name"
                className="block text-sm font-sans font-[450] text-gray-700"
              >
                Types of Rooms
              </label>
              <button type="button" className='relative right-16' onClick={handleAddRoomType}>
                <img src="src/assets/tabler_plus.svg" alt="Add room type" />
              </button>
            </div>

            <div className="h-32 overflow-y-auto pr-2">
              <div className="space-y-2">
                {roomTypes.map((room, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      className="h-8 w-[240px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
                      placeholder="Types of Rooms"
                      value={room.type}
                      onChange={(e) => handleRoomTypeChange(index, 'type', e.target.value)}
                    />
                    <input
                      type="text"
                      className="h-8 w-[299px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
                      placeholder="Number of Rooms"
                      value={room.count}
                      onChange={(e) => handleRoomTypeChange(index, 'count', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteRoomType(index)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Delete room type"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="license-number"
              className="block text-sm font-sans font-[450] mb-1"
            >
              Number of Floors
            </label>
            <input
              type="text"
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="license-number"
              className="block text-sm font-sans font-[450] mb-1"
            >
              Parking Capacity
            </label>
            <input
              type="text"
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          <button className="h-9 w-28 bg-[#5663AC] font-Montserrat font-[700] rounded-lg text-white relative top-10 ml-[32rem]">
            <span>Next </span>
            <span>➔</span>
          </button>
        </form>

        <div>
          <div className="w-[515px] relative left-[35%] h-screen bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 5 ? 'border-[#5C69F8] text-black' : 'text-black bg-white'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative top-36 left-[43.7%]" src="src/assets/Line.svg" alt="" />
            <img className="relative top-[80%] left-[43.7%]" src="src/assets/Line.svg" alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src="src/assets/property.svg"
                alt="Hotel Icon"
                className="h-24 mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">Property Details</h2>
              <p className="text-gray-600 font-sans font-[300] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[300]">You can always edit the data in the</span>
                <br />
                <span className="font-sans font-[300]">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Property;