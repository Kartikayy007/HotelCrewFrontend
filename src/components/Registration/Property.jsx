import React, { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import plus from '/tabler_plus.svg';
import hotelIcon from '/property.svg';
import line from '/Line.svg';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Property = ({ onNext, onBack, updateFormData, initialData }) => {
  const [roomTypes, setRoomTypes] = useState([
    { type: "", count: "", price: "" }
  ]);
  const [numberOfRooms, setNumberOfRooms] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [valetParking, setValetParking] = useState(false);
  const [parkingCapacity, setParkingCapacity] = useState("");
  const [error, setError] = useState("");
  const roomRefs = useRef([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  useEffect(() => {
    if (initialData) {
      const initialRoomTypes =
        initialData.room_types && initialData.room_types.length > 0
          ? initialData.room_types
          : [
              { type: "", count: "", price: "" },
              { type: "", count: "", price: "" },
              { type: "", count: "", price: "" },
            ];
      setRoomTypes(initialRoomTypes);

      setNumberOfRooms(initialData.total_number_of_rooms || "");
      setNumberOfFloors(initialData.number_of_floors || "");
      setValetParking(initialData.valet_parking_available || false);
      setParkingCapacity(initialData.valet_parking_capacity || "");
    }
  }, [initialData]);

  const handleAddRoomType = () => {
    setRoomTypes([...roomTypes, { type: "", count: "", price: "" }]);
    setError("");
  };

  const handleDeleteRoomType = (index) => {
    if (roomTypes.length > 1) {
      const newRoomTypes = roomTypes.filter((_, i) => i !== index);
      setRoomTypes(newRoomTypes);
    }
  };

  const handleRoomTypeChange = (index, field, value) => {
    const newRoomTypes = [...roomTypes];
    newRoomTypes[index][field] = value;
    setRoomTypes(newRoomTypes);
  };

  // const handleNumberInput = (e, setter) => {
  //   const value = e.target.value;
  //   if (/^\d*$/.test(value)) {
  //     setter(value);
  //   }
  // };
  const handleNumberInput = (e, setValue) => {
    const value = e.target.value;
    
    // Ensure the input is a valid number and not zero or just zeros
    const number = parseInt(value, 10);
    
    if (value === '' || (number > 0 && number.toString() === value)) {
      setValue(value);
    } else {
      // If the value is invalid (e.g., 0 or leading zeros), prevent it from being entered
      setSnackbar({
        open: true,
        message: "Please enter a valid number greater than 0.",
        severity: "error",
      });
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault();
  
    if (!numberOfRooms || !numberOfFloors || roomTypes.some(room => !room.type || !room.count || !room.price)) {
      setSnackbar({
        open: true,
        message: "Please fill out all required fields.",
        severity: "error",
      });
      const emptyRoomIndex = roomTypes.findIndex(room => !room.type || !room.count || !room.price);
      if (emptyRoomIndex !== -1 && roomRefs.current[emptyRoomIndex]) {
        roomRefs.current[emptyRoomIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }  
  
    // Convert price strings to numbers
    const formattedRoomTypes = roomTypes.map(room => ({
      ...room,
      price: parseFloat(room.price),
      count: parseInt(room.count)
    }));
  
    updateFormData(
      {
        total_number_of_rooms: parseInt(numberOfRooms),
        room_types: formattedRoomTypes,
        number_of_floors: parseInt(numberOfFloors),
        valet_parking_available: valetParking,
        valet_parking_capacity: valetParking ? parseInt(parkingCapacity) : "",
        room_price: formattedRoomTypes[0].price // Use first room type's price as base price
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

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <section className="min-h-screen bg-white flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-0 xl:ml-[5.1rem] m-auto p-0 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden gap-3 mb-4 bg-white relative font-medium top-3">
          {[1, 2, 3, 4, 5].map((num) => (
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

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-4">
          <img
            src={hotelIcon}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-3xl text-center font-medium font-Montserrat">
            Property Details
          </h2>
          <p className="font-sans text-lg font-medium text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="space-y-2 xl:w-full max-w-[330px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden xl:block xl:text-left">Property Details</h1>
          </div>

          <div>
            <label
              htmlFor="number-of-rooms"
              className="block text-lg font-sans font-semibold"
            >
              Number of Rooms
            </label>
            <input
              type="text"
              id="number-of-rooms"
              placeholder="Enter Total Number of Rooms"
              value={numberOfRooms}
              onChange={(e) => handleNumberInput(e, setNumberOfRooms)}
              className={`placeholder:text-base h-8 w-full xl:w-[623px] py-2 px-4 text-xl border rounded-[4px] focus:outline-none ${
                !numberOfRooms && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
            />
          </div>

          <div className="h-40 w-full">
            <div className="flex justify-between mb-2">
              <label
                htmlFor="types-of-rooms"
                className="block text-lg font-sans font-semibold"
              >
                Types of Rooms
              </label>
              <button
                type="button"
                className="xl:relative xl:left-[232px] relative right-4` "
                onClick={handleAddRoomType}
              >
                <img src={plus} alt="Add room type" />
              </button>
            </div>

            <div className="h-32 xl:w-[630px] w-full overflow-y-auto  pr-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
              <div className="space-y-2  overflow-x-auto scrollbar-hidden">
                {roomTypes.map((room, index) => (
                  <div 
                  key={index} 
                  ref={(el) => (roomRefs.current[index] = el)}
                  className="flex items-center gap-2 xl:gap-4">
                    <input
                      type="text"
                      className={`placeholder:text-base h-8 w-[110px] xl:w-[220px] py-2 xl:px-4 px-2 text-xl border rounded-[4px] focus:outline-none ${
                        !room.type && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                      } focus:border-purple-500`}
                      placeholder="Room Type"
                      value={room.type}
                      onChange={(e) =>
                        handleRoomTypeChange(index, "type", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`placeholder:text-base h-8 w-[70px] xl:w-[140px] py-2 px-2 xl:px-4 text-xl border rounded-[4px] focus:outline-none ${
                        !room.count && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                      } focus:border-purple-500`}
                      placeholder="Count"
                      value={room.count}
                      onChange={(e) =>
                        handleNumberInput(e, (value) =>
                          handleRoomTypeChange(index, "count", value)
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`placeholder:text-base h-8 w-[70px] xl:w-[140px] py-2 px-2 xl:px-4 text-xl border rounded-[4px] focus:outline-none ${
                        !room.price && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                      } focus:border-purple-500`}
                      placeholder="Price"
                      value={room.price}
                      onChange={(e) =>
                        handleNumberInput(e, (value) =>
                          handleRoomTypeChange(index, "price", value)
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
              className="block text-lg font-sans font-semibold mb-1"
            >
              Number of Floors
            </label>
            <input
              type="text"
              id="number-of-floors"
              placeholder="Total Floors "
              value={numberOfFloors}
              onChange={(e) => handleNumberInput(e, setNumberOfFloors)}
              className={`h-8 placeholder:text-base w-full xl:w-[623px] py-2 text-xl px-4 border rounded-[4px] focus:outline-none ${
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
                className="text-lg font-sans font-semibold"
              >
                Valet Parking Available
              </label>
            </div>

            {valetParking && (
              <div>
                <label
                  htmlFor="parking-capacity"
                  className="block text-lg font-sans font-semibold mb-1"
                >
                  Parking Capacity
                </label>
                <input
                  type="text"
                  id="parking-capacity"
                  value={parkingCapacity}
                  onChange={(e) => handleNumberInput(e, setParkingCapacity)}
                  className={`h-8 w-full xl:w-[623px] py-2 px-4 border rounded-[4px] focus:outline-none ${
                    !parkingCapacity && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                  } focus:border-purple-500`}
                  disabled={!valetParking}
                />
              </div>
            )}
          </div>
            <div className="h-5 xl:h-0">
          {error && <p className="text-[#99182C]">{error}</p>}
          </div>
          <div className={` px-1 xl:px-0 xl:left-auto xl:right-auto xl:fixed ${valetParking ? 'xl:top-[85vh]' : 'xl:top-[80vh]'}`}>
            <div className="flex justify-between xl:w-[42rem]">
              <button
                type="button"
                onClick={handleBackClick}
                className="h-9 w-28 bg-gray-400 font-Montserrat font-bold rounded-lg text-white"
              >
                <span>Back </span>
              </button>
              <button
                onClick={handleNextClick}
                className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white xl:fixed xl:left-[41.2vw]"
              >
                <span>Next </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </form>

        <div>
          <div className="hidden xl:block xl:w-[512px] font-medium fixed top-0 right-0 xl:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-7 text-[32px]">
              {[1, 2, 3, 4, 5].map((num) => (
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

            <img className="relative hidden xl:block top-36 left-[43.7%]" src={line} alt="" />
            <img className="relative hidden xl:block top-[80%] left-[43.7%]" src={line} alt="" />
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src={hotelIcon}
                alt="Hotel Icon"
                className="h-24 mb-4 text-[#5663AC]"
              />
              <h2 className="text-2xl font-medium font-Montserrat">
                Property Details
              </h2>
              <p className="font-sans font-normal text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-normal text-center">
                  You can always edit the data in the
                </span>
                <br />
                <span className="font-sans font-normal text-center">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
        </Snackbar>
    </section>
  );
};

export default Property;