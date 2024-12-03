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
    `h-8 w-full xl:w-[623px] py-2 px-4 text-xl border rounded-[4px] focus:outline-none ${
      !value && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
    } focus:border-purple-500`;

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-4 xl:ml-[5.1rem] m-auto p-4 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden bg-white gap-3 mb-4 relative font-medium top-2">
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

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 mb-4 mt-2">
          <img
            src={hotelIcon}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-3xl font-medium text-center font-Montserrat">
            Hotel Information
          </h2>
          <p className="font-sans font-normal  text-lg text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="xl:space-y-7 space-y-5 w-[90vw] max-w-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden xl:block xl:text-left">Hotel Information</h1>
          </div>

          <div>
            <label
              htmlFor="hotel-name"
              className="block text-lg font-sans font-semibold"
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
              className="block text-lg font-sans font-semibold mb-1"
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
              className="block text-lg font-sans font-semibold mb-1"
            >
              Year Established*
            </label>
            <input
              type="text"
              id="year-established"
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
              className="block text-lg font-sans font-semibold mb-1"
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

          {error && <p className="text-[#99182C] xl:fixed">{error}</p>}

          <div className="xl:fixed xl:top-[80vh] xl:left-[4vw] text-center">
            <button 
              onClick={handleNextClick} 
              className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white mx-auto xl:ml-[32rem]"
            >
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>

        <div>
          <div className="hidden xl:block xl:w-[512px] font-medium fixed top-0 right-0 xl:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-[32px]">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 1 ? 'border-[#5C69F8] text-black' : 'text-black bg-white border-none'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative top-36 left-[43.7%]" src={lineIcon} alt="" />
            <img className="relative top-[80%] left-[43.7%]" src={lineIcon} alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img 
                src={hotelIcon}
                alt="Hotel Icon"
                className="h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">
                Hotel Information
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

export default Hoteldetails;