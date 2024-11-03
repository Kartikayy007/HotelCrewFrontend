import React, { useState, useEffect } from 'react';

const Hoteldetails = ({ onNext, updateFormData, initialData }) => {
  const [hotelName, setHotelName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setHotelName(initialData.hotelName || '');
      setLegalName(initialData.legalName || '');
      setYearEstablished(initialData.yearEstablished || '');
      setLicenseNumber(initialData.licenseNumber || '');
    }
  }, [initialData]);

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!hotelName || !yearEstablished || !licenseNumber) {
      setError('Please fill out all required fields.');
      return;
    }
    const formData = {
      hotelName,
      legalName,
      yearEstablished,
      licenseNumber
    };

    updateFormData(formData);
    onNext();
  };

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-9 lg:ml-[5.1rem] m-auto">
      <div className="flex lg:hidden  gap-3 mb-4 ">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 1 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
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

        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[600] hidden lg:block">Hotel Information</h1>
          </div>

          <div>
            <label
              htmlFor="hotel-name"
              className="block text-sm font-sans font-[600]"
            >
              Hotel Name
            </label>
            <input
              type="text"
              id="hotel-name"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="h-8 lg:w-[623px] w-[380px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="legal-business-name"
              className="block text-sm font-sans font-[600]  mb-1"
            >
              Legal Business Name (optional)
            </label>
            <input
              type="text"
              id="legal-business-name"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="h-8 w-[380px] lg:w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="year-established"
              className="block text-sm font-sans font-[600] mb-1"
            >
              Year Established
            </label>
            <input
              type="text"
              id="year-established"
              value={yearEstablished}
              onChange={(e) => handleNumberInput(e, setYearEstablished)}
              className="h-8 w-[380px] lg:w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="license-number"
              className="block text-sm font-sans font-[600] mb-1"
            >
              License Number
            </label>
            <input
              type="text"
              id="license-number"
              value={licenseNumber}
              onChange={(e) => handleNumberInput(e, setLicenseNumber)}
              className="h-8 w-[380px] lg:w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 fixed">{error}</p>}

          <div className='lg:relative top-[0.89rem] flex justify-center'>
            <button onClick={handleNextClick} className="h-9 w-[7rem] bg-[#5663AC] font-Montserrat font-[700] rounded-lg text-white lg:relative top-10 lg:ml-[32rem]">
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>

        <div >
          <div className="hidden lg:block lg:w-[512px] font-medium relative left-[26%] lg:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 relative top-11 text-2xl items-center">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-1 font-medium left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${num === 1 ? 'border-[#5C69F8] text-black' : ' bg-white border-none'
                    }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative hidden lg:block top-36 left-[43.7%]" src="src/assets/Line.svg" alt="" />
            <img className="relative hidden lg:block top-[80%] left-[43.7%]" src="src/assets/Line.svg" alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src="src/assets/hotel.svg"
                alt="Hotel Icon"
                className=" h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[500] font-Montserrat">Hotel Information</h2>
              <p className="font-sans font-[400] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[400]"> You can always edit the data in the </span>
                <br />
                <span className="font-sans font-[400]"> setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hoteldetails;