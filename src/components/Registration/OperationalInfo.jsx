import React, { useState } from 'react';

function OperationalInfo({ onNext, onBack, updateFormData }) {
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [paymentMethods, setPaymentMethods] = useState('');

  const handleNextClick = (e) => {
    e.preventDefault();
    const formData = {
      checkInTime,
      checkOutTime,
      paymentMethods
    };
    
    updateFormData(formData);
    onNext();
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center ">
      <div className="flex justify-center items-center gap-9 ml-[5.1rem]">
        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[550]">Operational Information</h1>
          </div>

          <div>
            <label
              htmlFor="check-in-check-out"
              className="block text-sm font-sans font-[450] text-gray-700 mb-1"
            >
              Check-in & Check outs 
            </label>

            <input
              type="text"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="h-8 w-[299px] mr-6 py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder='Check-in timings'
            />

            <input
              type="text"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="h-8 w-[299px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder='Check-out timings'
            />
          </div>

          <div>
            <label
              htmlFor="payment-methods"
              className="block text-sm font-sans font-[450] mb-1"
            >
              Payment Methods
            </label>
            <input
              type="text"
              value={paymentMethods}
              onChange={(e) => setPaymentMethods(e.target.value)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder='Add Methods'
            />
          </div>

          <div className='relative top-[8.5rem]'>
          <div className="flex justify-between">
            <button type="button" onClick={onBack} className="h-9 w-[7rem] bg-gray-400 font-Montserrat font-[700] rounded-lg text-white">
              <span>Back </span>
               
            </button>
            <button onClick={handleNextClick} className="h-9 w-[7rem] bg-[#5663AC] font-Montserrat font-[700] rounded-lg text-white">
              <span>Next </span>
              <span>➔</span>
            </button>
          </div>
          </div>
        </form>

        <div>
          <div className="w-[515px] relative left-[35%] h-[100vh] bg-white shadow-2xl border-none rounded-lg">
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

            <div className="flex flex-col items-center justify-center h-full space-y-4 ">
              <img 
                src="src/assets/operational.svg" 
                alt="Hotel Icon" 
                className=" h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">Operational Information</h2>
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
}

export default OperationalInfo;