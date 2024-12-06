import React, { useState, useEffect } from 'react';
import HotelIcon from '/operational.svg';
import lineIcon from '/Line.svg';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function OperationalInfo({ onNext, onBack, updateFormData, initialData }) {
  const [checkInTime, setCheckInTime] = useState(initialData.check_in_time || '');
  const [checkOutTime, setCheckOutTime] = useState(initialData.check_out_time || '');
  const [paymentMethods, setPaymentMethods] = useState(initialData.payment_methods || '');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  useEffect(() => {
    if (initialData) {
      setCheckInTime(initialData.check_in_time || '');
      setCheckOutTime(initialData.check_out_time || '');
      setPaymentMethods(initialData.payment_methods || '');
    }
  }, [initialData]);

  // Format time to match required format
  const formatTime = (time) => {
    if (!time) return '';
    // Convert time to HH:mm:ss format
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const handleNextClick = (e) => {
    e.preventDefault();

    // Validate fields
    if (!checkInTime || !checkOutTime || !paymentMethods.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill out all required fields.",
        severity: "error",
      });
      return;
    }

    // Format time strings with seconds
    const formattedTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    };

    const formData = {
      check_in_time: formattedTime(checkInTime),
      check_out_time: formattedTime(checkOutTime),
      payment_methods: paymentMethods.trim()
    };

     ('Sending operational data:', formData);
    updateFormData(formData, 5);
    onNext(formData);
  };

  const handleOperationalInfoSubmit = async (operationalData) => {
    try {
      // Format times and validate data
      const formattedData = {
        ...operationalData,
        check_in_time: formatTime(operationalData.check_in_time),
        check_out_time: formatTime(operationalData.check_out_time),
        payment_methods: operationalData.payment_methods.trim(),
        // Use the first room type's price as room_price
        room_price: formData.room_types[0]?.price || 0
      };
  
      const currentFormData = {
        ...formData,
        ...formattedData
      };
      
      const transformedData = transformFormData(currentFormData);
      
      // Log the data being sent
       ('Sending data:', transformedData);
      
      const result = await dispatch(completeMultiStepForm(transformedData)).unwrap();
      
      if (result) {
        setSnackbar({
          open: true,
          message: "Hotel details registered successfully!",
          severity: "success",
        });
        handleNext();
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to register hotel details",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-8 xl:ml-[5.1rem] m-auto p-0 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden font-medium gap-3 mb-4 relative top-0">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 5 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 my-4">
          <img
            src={HotelIcon}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-3xl text-center font-medium text-neutral-950 font-Montserrat">
            Operational Information
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
            <h1 className="text-[32px] font-semibold hidden xl:block xl:whitespace-nowrap xl:text-left">Operational Information</h1>
          </div>

          <div>
            <label
              htmlFor="check-in-time"
              className="block text-lg font-sans font-[600] text-neutral-950 mb-1"
            >
              Check-in Time
            </label>
            <input
              type="time"
              id="check-in-time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className={`placeholder:text-base h-8 w-[182px] xl:w-[299px] mr-6 py-1 px-4 border rounded-[4px] text-lg focus:outline-none ${
                !checkInTime && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
            />
          </div>

          <div>
            <label
              htmlFor="check-out-time"
              className="block text-lg font-sans font-[600] text-neutral-950 mb-1"
            >
              Check-out Time
            </label>
            <input
              type="time"
              id="check-out-time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className={`h-8 placeholder:text-base w-[182px] xl:w-[299px] py-1 px-4 border rounded-[4px] text-xl focus:outline-none ${
                !checkOutTime && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
              placeholder='Check-out timings'
            />
          </div>

          <div>
            <label
              htmlFor="payment-methods"
              className="block text-lg font-sans font-[600] mb-1"
            >
              Payment Methods*
            </label>
            <input
              type="text"
              id="payment-methods"
              value={paymentMethods}
              onChange={(e) => setPaymentMethods(e.target.value)}
              className={`h-8 w-[330px]placeholder:text-base  xl:w-[623px] py-2 px-4 border rounded-[4px] text-xl focus:outline-none ${
                !paymentMethods && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
              placeholder='e.g., Cash, Credit Card, UPI'
            />
          </div>

          <div className='h-5'>
            {error && <p className="text-[#99182C] fixed">{error}</p>}
          </div>
          <div className="px-1 xl:px-0 xl:left-auto xl:right-auto xl:fixed xl:top-[80vh]">
            <div className="flex justify-between xl:w-[42rem]">
              <button type="button" onClick={onBack} className="h-9 w-[7rem] bg-gray-400 font-Montserrat font-[700] rounded-lg text-white">
                <span>Back </span>
              </button>
              <button onClick={handleNextClick} className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white xl:fixed xl:left-[41.2vw]">
                <span>Submit </span>
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
                    num === 5 ? 'border-[#5C69F8] text-black' : 'text-black bg-white border-none'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative top-36 left-[43.7%]" src={lineIcon} alt="" />
            <img className="relative top-[80%] left-[43.7%]" src={lineIcon} alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y-4 ">
              <img 
                src={HotelIcon}
                alt="Hotel Icon" 
                className=" h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[500] font-Montserrat">Operational Information</h2>
              <p className="font-sans font-normal text-center">
                Fill out the form on the left.
                <br />
                <span className='font-sans font-normal text-center' > You can always edit the data in the </span>
                <br />
                <span className='font-sans font-normal text-center'> setting menu.</span>
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
}

export default OperationalInfo;