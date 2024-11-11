import React, { useState, useEffect } from 'react';
import hotelIcon from '/hotel.svg';
import lineIcon from '/Line.svg';

const Hoteldetails = ({ onNext, updateFormData, initialData }) => {
  const [hotelName, setHotelName] = useState('');
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [licenseRegistrationNumbers, setLicenseRegistrationNumbers] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setHotelName(initialData.hotel_name || '');
      setLegalBusinessName(initialData.legal_business_name || '');
      setYearEstablished(initialData.year_established || '');
      setLicenseRegistrationNumbers(initialData.license_registration_numbers || '');
    }
  }, [initialData]);

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!hotelName || !yearEstablished || !licenseRegistrationNumbers || !legalBusinessName) {
      setError('Please fill out all required fields.');
      return;
    }

    const formData = {
      hotel_name: hotelName,
      legal_business_name: legalBusinessName,
      year_established: parseInt(yearEstablished),
      license_registration_numbers: licenseRegistrationNumbers
    };

    updateFormData(formData);
    onNext();
  };

  const handleYearInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setYearEstablished(value);
    }
  };

  const inputClass = (value) =>
    `h-8 w-full lg:w-[623px] py-2 px-4 text-xs border rounded-[4px] focus:outline-none ${
      !value && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
    } focus:border-purple-500`;

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:ml-[5.1rem] m-auto p-4 lg:p-0 lg:gap-52 ">
        <div className="flex lg:hidden gap-3 mb-4 fixed lg:top-9 top-1">
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

        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src={hotelIcon}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-[32px] font-medium font-Montserrat">
            Hotel Information
          </h2>
          <p className="font-sans font-normal text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="lg:space-y-7 space-y-5 w-[90vw] max-w-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden lg:block lg:text-left">Hotel Information</h1>
          </div>

          <div>
            <label
              htmlFor="hotel-name"
              className="block text-sm font-sans font-semibold"
            >
              Hotel Name*
            </label>
            <input
              type="text"
              id="hotel-name"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className={inputClass(hotelName)}
            />
          </div>

          <div>
            <label
              htmlFor="legal-business-name"
              className="block text-sm font-sans font-semibold mb-1"
            >
              Legal Business Name 
            </label>
            <input
              type="text"
              id="legal-business-name"
              value={legalBusinessName}
              onChange={(e) => setLegalBusinessName(e.target.value)}
              className={inputClass(legalBusinessName)}
            />
          </div>

          <div>
            <label
              htmlFor="year-established"
              className="block text-sm font-sans font-semibold mb-1"
            >
              Year Established*
            </label>
            <input
              type="text"
              id="year-established"
              // pattern="^(19|20)\d{2}$" 
              value={yearEstablished}
              onChange={handleYearInput}
              placeholder="YYYY"
              maxLength={4}
              className={inputClass(yearEstablished)}
            />
          </div>

          <div>
            <label
              htmlFor="license-registration-numbers"
              className="block text-sm font-sans font-semibold mb-1"
            >
              License/Registration Numbers*
            </label>
            <input
              type="text"
              id="license-registration-numbers"
              value={licenseRegistrationNumbers}
              onChange={(e) => setLicenseRegistrationNumbers(e.target.value)}
              className={inputClass(licenseRegistrationNumbers)}
            />
          </div>

          {error && <p className="text-[#99182C] lg:fixed">{error}</p>}

          <div className="lg:fixed lg:top-[80vh] lg:left-[4vw] text-center">
            <button 
              onClick={handleNextClick} 
              className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white mx-auto lg:ml-[32rem]"
            >
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>

        <div>
          <div className="hidden lg:block lg:w-[30.476vw] font-medium fixed right-0 top-0 lg:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex lg:gap-5 gap-0 text-[32px]">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 lg:left-20 left-4 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 1
                      ? "border-[#5C69F8] text-black"
                      : "text-black bg-white border-none"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative hidden lg:block top-36 left-[43.7%]" src={lineIcon} alt="" />
            <img className="relative hidden lg:block top-[80%] left-[43.7%]" src={lineIcon} />

            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img 
                src={hotelIcon} 
                alt="Hotel Icon" 
                className="h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[500] font-Montserrat">Hotel Information</h2>
              <p className="font-sans font-[400] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[300]">You can always edit the data in the </span>
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

export default Hoteldetails;