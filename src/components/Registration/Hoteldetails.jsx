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
      <div className="flex justify-center items-center gap-9 ml-[5.1rem]">
        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[550]">Hotel Information</h1>
          </div>

          <div>
            <label
              htmlFor="hotel-name"
              className="block text-sm font-sans font-[450]"
            >
              Hotel Name
            </label>
            <input
              type="text"
              id="hotel-name"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="legal-business-name"
              className="block text-sm font-sans font-[450] text-gray-700 mb-1"
            >
              Legal Business Name (optional)
            </label>
            <input
              type="text"
              id="legal-business-name"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="year-established"
              className="block text-sm font-sans font-[450] mb-1"
            >
              Year Established
            </label>
            <input
              type="text"
              id="year-established"
              value={yearEstablished}
              onChange={(e) => handleNumberInput(e, setYearEstablished)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="license-number"
              className="block text-sm font-sans font-[450] mb-1"
            >
              License Number
            </label>
            <input
              type="text"
              id="license-number"
              value={licenseNumber}
              onChange={(e) => handleNumberInput(e, setLicenseNumber)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 fixed">{error}</p>}

          <div className='relative top-[0.89rem]'>
            <button onClick={handleNextClick} className="h-9 w-[7rem] bg-[#5663AC] font-Montserrat font-[700] rounded-lg text-white relative top-10 ml-[32rem]">
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
        </form>

        <div>
          <div className="w-[515px] relative left-[35%] h-[100vh] bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 1 ? 'border-[#5C69F8] text-black' : 'text-black bg-white'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative top-36 left-[43.7%]" src="src/assets/Line.svg" alt="" />
            <img className="relative top-[80%] left-[43.7%]" src="src/assets/Line.svg" alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y-4 ">
              <img 
                src="src/assets/hotel.svg" 
                alt="Hotel Icon" 
                className=" h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">Hotel Information</h2>
              <p className="text-gray-600 font-sans font-[300] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[300]"> You can always edit the data in the </span>
                <br />
                <span className="font-sans font-[300]"> setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hoteldetails;