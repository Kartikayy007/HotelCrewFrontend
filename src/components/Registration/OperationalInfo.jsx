import React, { useState, useEffect } from 'react';
import HotelIcon from '/operational.svg';
import lineIcon from '/Line.svg';

function OperationalInfo({ onNext, onBack, updateFormData, initialData }) {
  const [checkInTime, setCheckInTime] = useState(initialData.check_in_time || '');
  const [checkOutTime, setCheckOutTime] = useState(initialData.check_out_time || '');
  const [paymentMethods, setPaymentMethods] = useState(initialData.payment_methods || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCheckInTime(initialData.check_in_time || '');
      setCheckOutTime(initialData.check_out_time || '');
      setPaymentMethods(initialData.payment_methods || '');
    }
  }, [initialData]);

  const handleNextClick = (e) => {
    e.preventDefault();
  
    if (!checkInTime || !checkOutTime || !paymentMethods) {
      setError('Please fill out all required fields.');
      return;
    }
  
    const formData = { check_in_time: checkInTime, check_out_time: checkOutTime, payment_methods: paymentMethods };
    console.log('Updating form data with:', formData); 
    updateFormData(formData, 5); 
    onNext();
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-0 xl:ml-[5.1rem] m-auto p-0 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden font-medium gap-3 mb-4 fixed xl:top-9 top-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
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

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-20">
          <img
            src={HotelIcon}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-[32px] font-medium font-Montserrat">
            Operational Information
          </h2>
          <p className="font-sans font-normal text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="space-y-2 xl:w-full max-w-[330px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden xl:block xl:text-left">Operational Information</h1>
          </div>

          <div>
            <label
              htmlFor="check-in-time"
              className="block text-sm font-sans font-[600] text-neutral-950 mb-1"
            >
              Check-in Time
            </label>
            <input
              type="time"
              id="check-in-time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className={`placeholder:text-base h-8 w-[182px] xl:w-[299px] mr-6 py-2 px-4 border rounded-[4px] text-xl focus:outline-none ${
                !checkInTime && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
            />
          </div>

          <div>
            <label
              htmlFor="check-out-time"
              className="block text-sm font-sans font-[450] text-gray-700 mb-1"
            >
              Check-out Time
            </label>
            <input
              type="time"
              id="check-out-time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className={`h-8 w-[182px] xl:w-[299px] py-2 px-4 border rounded-[4px] text-xl focus:outline-none ${
                !checkOutTime && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
              placeholder='Check-out timings'
            />
          </div>

          <div>
            <label
              htmlFor="payment-methods"
              className="block text-sm font-sans font-[600] mb-1"
            >
              Payment Methods
            </label>
            <input
              type="text"
              id="payment-methods"
              value={paymentMethods}
              onChange={(e) => setPaymentMethods(e.target.value)}
              className={`h-8 w-[330px] xl:w-[623px] py-2 px-4 border rounded-[4px] text-xl focus:outline-none ${
                !paymentMethods && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
              placeholder='Add Methods'
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
                <span>Next </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </form>

        <div>
          <div className="hidden xl:block xl:w-[512px] font-medium fixed top-0 right-0 xl:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-[32px]">
              {[1, 2, 3, 4, 5, 6].map((num) => (
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
              <p className="font-sans font-[400] text-[16px] text-center">
                Fill out the form on the left.
                <br />
                <span > You can always edit the data in the </span>
                <br />
                <span> setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OperationalInfo;