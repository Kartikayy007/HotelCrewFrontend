import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import plus from '/tabler_plus.svg';
import hotelIcon from '/property.svg';
import line from '/Line.svg';

const Property = ({ onNext, onBack, updateFormData, initialData }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [numberOfRooms, setNumberOfRooms] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [valetParking, setValetParking] = useState(false);
  const [parkingCapacity, setParkingCapacity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      const initialRoomTypes =
        initialData.room_types && initialData.room_types.length > 0
          ? initialData.room_types
          : [
              { type: "", count: "" },
              { type: "", count: "" },
              { type: "", count: "" },
            ];
      setRoomTypes(initialRoomTypes);

      setNumberOfRooms(initialData.total_number_of_rooms || "");
      setNumberOfFloors(initialData.number_of_floors || "");
      setValetParking(initialData.valet_parking_available || false);
      setParkingCapacity(initialData.valet_parking_capacity || "");
    }
  }, [initialData]);

  const handleAddRoomType = () => {
    setRoomTypes([...roomTypes, { type: "", count: "" }]);
    setError("");
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
    if (!numberOfRooms || !numberOfFloors || roomTypes.some(room => !room.type || !room.count)) {
      setError("Please fill out all required fields.");
      return;
    }

    updateFormData(
      {
        total_number_of_rooms: numberOfRooms,
        room_types: roomTypes,
        number_of_floors: numberOfFloors,
        valet_parking_available: valetParking,
        valet_parking_capacity: valetParking ? parkingCapacity : "",
      },
      4
    );

    onNext();
  };

  const handleBackClick = () => {
    updateFormData(
      {
        total_number_of_rooms: numberOfRooms,
        room_types: roomTypes,
        number_of_floors: numberOfFloors,
        valet_parking_available: valetParking,
        valet_parking_capacity: valetParking ? parkingCapacity : "",
      },
      4
    );

    onBack();
  };

  return (
    <section className="min-h-screen bg-white flex items-center overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-0 lg:ml-[5.1rem] m-auto p-0 lg:p-0 lg:gap-52">
        <div className="flex lg:hidden gap-3 mb-4 fixed top-9">
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

        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-20">
          <img
            src={hotelIcon}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-[32px] font-medium font-Montserrat">
            Property Details
          </h2>
          <p className="font-sans font-normal text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="space-y-2 lg:w-full max-w-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden lg:block lg:text-left">Property Details</h1>
          </div>

          <div>
            <label
              htmlFor="number-of-rooms"
              className="block text-sm font-sans font-semibold"
            >
              Number of Rooms
            </label>
            <input
              type="text"
              id="number-of-rooms"
              value={numberOfRooms}
              onChange={(e) => handleNumberInput(e, setNumberOfRooms)}
              className={`h-8 w-96 lg:w-[623px] py-2 px-4 text-xs border rounded-[4px] focus:outline-none ${
                !numberOfRooms && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
            />
          </div>

          <div className="h-40 w-96">
            <div className="flex justify-between mb-2">
              <label
                htmlFor="types-of-rooms"
                className="block text-sm font-sans font-semibold"
              >
                Types of Rooms
              </label>
              <button
                type="button"
                className="relative right-16"
                onClick={handleAddRoomType}
              >
                <img src={plus} alt="Add room type" />
              </button>
            </div>

            <div className="h-32 overflow-y-auto pr-2">
              <div className="space-y-2">
                {roomTypes.map((room, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      className={`h-8 w-[172px] lg:w-[299px] py-2 px-4 text-xs border rounded-[4px] focus:outline-none ${
                        !room.type && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                      } focus:border-purple-500`}
                      placeholder="Types of Rooms"
                      value={room.type}
                      onChange={(e) =>
                        handleRoomTypeChange(index, "type", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`h-8 w-[142px] lg:w-[260px] py-2 px-4 text-xs border rounded-[4px] focus:outline-none ${
                        !room.count && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                      } focus:border-purple-500`}
                      placeholder="Number of Rooms"
                      value={room.count}
                      onChange={(e) =>
                        handleNumberInput(e, (value) =>
                          handleRoomTypeChange(index, "count", value)
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteRoomType(index)}
                      className="p-2 text-gray-500 hover:text-[#99182C] transition-colors"
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
              className="block text-sm font-sans font-semibold mb-1"
            >
              Number of Floors
            </label>
            <input
              type="text"
              id="number-of-floors"
              value={numberOfFloors}
              onChange={(e) => handleNumberInput(e, setNumberOfFloors)}
              className={`h-8 w-full lg:w-[623px] py-2 text-xs px-4 border rounded-[4px] focus:outline-none ${
                !numberOfFloors && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="valetParking"
                checked={valetParking}
                onChange={(e) => {
                  setValetParking(e.target.checked);
                  if (!e.target.checked) {
                    setParkingCapacity("");
                  }
                }}
                className="h-4 w-4 text-[#5663AC] rounded border-gray-300 focus:ring-[#5663AC]"
              />
              <label
                htmlFor="valetParking"
                className="text-sm font-sans font-semibold"
              >
                Valet Parking Available
              </label>
            </div>

            {valetParking && (
              <div>
                <label
                  htmlFor="parking-capacity"
                  className="block text-sm font-sans font-semibold mb-1"
                >
                  Parking Capacity
                </label>
                <input
                  type="text"
                  id="parking-capacity"
                  value={parkingCapacity}
                  onChange={(e) => handleNumberInput(e, setParkingCapacity)}
                  className={`h-8 w-full lg:w-[623px] py-2 px-4 border rounded-lg focus:outline-none ${
                    !parkingCapacity && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                  } focus:border-purple-500`}
                  disabled={!valetParking}
                />
              </div>
            )}
          </div>

          {error && <p className="text-[#99182C]">{error}</p>}

          <div className={` px-1 lg:px-0 lg:left-auto lg:right-auto lg:fixed ${valetParking ? 'lg:top-[85vh]' : 'lg:top-[80vh]'}`}>
            <div className="flex justify-between lg:w-[42rem]">
              <button
                type="button"
                onClick={handleBackClick}
                className="h-9 w-28 bg-gray-400 font-Montserrat font-bold rounded-lg text-white"
              >
                <span>Back </span>
              </button>
              <button
                onClick={handleNextClick}
                className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white lg:fixed lg:left-[41.2vw]"
              >
                <span>Next </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </form>

        <div>
          <div className="hidden lg:block lg:w-[512px] font-medium fixed top-0 right-0 lg:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-[32px]">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 4
                      ? "border-[#5C69F8] text-black"
                      : "text-black bg-white border-none"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative hidden lg:block top-36 left-[43.7%]" src={line} alt="" />
            <img className="relative hidden lg:block top-[80%] left-[43.7%]" src={line} alt="" />
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src={hotelIcon}
                alt="Hotel Icon"
                className="h-24 mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">
                Property Details
              </h2>
              <p className="text-gray-600 font-sans font-[300] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[300]">
                  You can always edit the data in the
                </span>
                <br />
                <span>setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Property;