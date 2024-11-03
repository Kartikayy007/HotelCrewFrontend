import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const Property = ({ onNext, onBack, updateFormData, initialData }) => {
  const [roomTypes, setRoomTypes] = useState(initialData.roomTypes || [
    { type: '', count: '' },
    { type: '', count: '' },
    { type: '', count: '' }
  ]);
  const [numberOfRooms, setNumberOfRooms] = useState(initialData.numberOfRooms || '');
  const [numberOfFloors, setNumberOfFloors] = useState(initialData.numberOfFloors || '');
  const [parkingCapacity, setParkingCapacity] = useState(initialData.parkingCapacity || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setRoomTypes(initialData.roomTypes || [
        { type: '', count: '' },
        { type: '', count: '' },
        { type: '', count: '' }
      ]);
      setNumberOfRooms(initialData.numberOfRooms || '');
      setNumberOfFloors(initialData.numberOfFloors || '');
      setParkingCapacity(initialData.parkingCapacity || '');
    }
  }, [initialData]);

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

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!numberOfRooms || !numberOfFloors || !parkingCapacity) {
      setError('Please fill out all required fields.');
      return;
    }
    const formData = {
      numberOfRooms,
      roomTypes,
      numberOfFloors,
      parkingCapacity
    };
    
    updateFormData(formData);
    onNext();
  };

  return (
    <section className="min-h-screen bg-white flex items-center overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-9 lg:ml-20 mx-auto">
      <div className="flex lg:hidden gap-3 mb-4 ">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 4 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Mobile Content Block */}
        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src="src/assets/hotel.svg"
            alt="Hotel Icon"
            className="h-[96] mb-4 text-[#5663AC]"
          />
          <h2 className="text-[24px] font-[500] font-Montserrat">
            Hotel Information
          </h2>
          <p className="font-sans font-[400] text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>
        <form className="space-y-7 relative"> 
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[550]">Property Details</h1>
          </div>

          <div>
            <label
              htmlFor="number-of-rooms"
              className="block text-sm font-sans font-[600]"
            >
              Number of Rooms
            </label>
            <input
              type="text"
              id="number-of-rooms"
              value={numberOfRooms}
              onChange={(e) => handleNumberInput(e, setNumberOfRooms)}
              className="h-8 text-xs w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          <div className="h-40"> 
            <div className="flex justify-between mb-2">
              <label
                htmlFor="types-of-rooms"
                className="block text-sm font-sans font-[600] "
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
                      className="h-8 w-[299px] py-2 px-4 text-xs border border-[#BDBDBD] rounded-[4px] focus:outline-none"
                      placeholder="Types of Rooms"
                      value={room.type}
                      onChange={(e) => handleRoomTypeChange(index, 'type', e.target.value)}
                    />
                    <input
                      type="text"
                      className="h-8 w-[260px] py-2 px-4 text-xs border border-[#BDBDBD] rounded-[4px] focus:outline-none"
                      placeholder="Number of Rooms"
                      value={room.count}
                      onChange={(e) => handleNumberInput(e, (value) => handleRoomTypeChange(index, 'count', value))}
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
              htmlFor="number-of-floors"
              className="block text-sm font-sans font-[600] mb-1"
            >
              Number of Floors
            </label>
            <input
              type="text"
              id="number-of-floors"
              value={numberOfFloors}
              onChange={(e) => handleNumberInput(e, setNumberOfFloors)}
              className="h-8 w-[623px] py-2 text-xs px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="parking-capacity"
              className="block text-sm font-sans font-[600] mb-1"
            >
              Parking Capacity
            </label>
            <input
              type="text"
              id="parking-capacity"
              value={parkingCapacity}
              onChange={(e) => handleNumberInput(e, setParkingCapacity)}
              className="h-8 w-[623px] text-xs py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 fixed bottom-[16%]">{error}</p>}

          <div className="flex justify-between relative top-5">
            <button type="button" onClick={onBack} className="h-9 w-28 bg-gray-400 font-[700] rounded-lg text-white ">
              <span>Back </span>
            </button>
            <button onClick={handleNextClick} className="h-9 w-28 bg-[#5663AC] font-[700] rounded-lg text-white">
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>

        <div>
          <div className="w-[515px] lg:block hidden relative font-medium left-[26%] h-screen bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 4 ? 'border-[#5C69F8] text-black' : 'text-black bg-white border-none'
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
              <h2 className="text-[24px] font-[500] font-Montserrat">Property Details</h2>
              <p className=" font-sans text-[16px] font-[400] text-center">
                Fill out the form on the left.
                <br />
                <span >You can always edit the data in the</span>
                <br />
                <span >setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Property;