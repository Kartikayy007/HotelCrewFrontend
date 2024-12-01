
import React, { useState, useEffect } from "react";
import contactIcon from "/contact.svg";
import lineIcon from '/Line.svg';

function ContactInfo({ onNext, onBack, updateFormData, initialData }) {
  const [completeAddress, setCompleteAddress] = useState("");
  const [mainPhoneNumber, setMainPhoneNumber] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setCompleteAddress(initialData.complete_address || "");
      setMainPhoneNumber(initialData.main_phone_number || "");
      setEmergencyPhoneNumber(initialData.emergency_phone_number || "");
      setEmailAddress(initialData.email_address || "");
    }
  }, [initialData]);

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!completeAddress || !mainPhoneNumber || !emergencyPhoneNumber || !emailAddress) {
      setError('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneNumberRegex = /^\d{10}$/;
    if(!phoneNumberRegex.test(mainPhoneNumber) || !phoneNumberRegex.test(emergencyPhoneNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }

    const formData = {
      complete_address: completeAddress,
      main_phone_number: mainPhoneNumber,
      emergency_phone_number: emergencyPhoneNumber,
      email_address: emailAddress
    };

    updateFormData(formData);
    onNext();
  };

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setter(value);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-0 xl:ml-[5.1rem] m-auto p-0 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden bg-white font-medium gap-3 mb-4 fixed  top-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 2 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src={contactIcon}
            alt="Contact Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-[32px] text-center font-medium font-Montserrat">
            Contact & Location
          </h2>
          <p className="font-sans font-normal text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="space-y-7 w-full xl:w-40-">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden xl:block xl:text-left">Contact & Location</h1>
          </div>

          <div>
            <label
              htmlFor="complete-address"
              className="block text-sm font-sans font-semibold"
            >
              Complete Address*
            </label>
            <input
              type="text"
              id="complete-address"
              value={completeAddress}
              onChange={(e) => setCompleteAddress(e.target.value)}
              className={`h-8 w-full xl:w-[623px] py-2 px-4 text-xl border rounded-[4px] focus:outline-none ${
                !completeAddress && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
              placeholder="Enter full address"
            />
          </div>

          <div className="flex justify-between items-end gap-3">
            <div>
              <label
                htmlFor="phone-number"
                className="block text-sm font-sans font-semibold mb-1"
              >
                Phone Numbers*
              </label>

              <input
                type="tel"
                id="main-phone"
                value={mainPhoneNumber}
                onChange={(e) => handleNumberInput(e, setMainPhoneNumber)}
                className={`h-8 w-full xl:w-[299px] py-2 px-4 text-xl border rounded-[4px] focus:outline-none ${
                  !mainPhoneNumber && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                } focus:border-purple-500`}
                placeholder="Main number"
                maxLength={10}
                minLength={10}
              />
            </div>
            <input
              type="tel"
              id="emergency-phone"
              value={emergencyPhoneNumber}
              onChange={(e) => handleNumberInput(e, setEmergencyPhoneNumber)}
              className={`h-8 w-1/2 xl:w-[299px] py-2 px-4 text-xl border rounded-[4px] focus:outline-none ${
                !emergencyPhoneNumber && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500 xl:ml-4`}
              placeholder="Emergency number"
              maxLength={10}
            />
          </div>

          <div>
            <label
              htmlFor="hotel-email"
              className="block text-sm font-sans font-semibold mb-1"
            >
              Hotel Email*
            </label>
            <input
              type="email"
              id="hotel-email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className={`h-8 w-full xl:w-[623px] py-2 px-4 text-xl border rounded-[4px] focus:outline-none ${
                !emailAddress && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
              } focus:border-purple-500`}
              placeholder="hotel@example.com"
            />
          </div>
              <div className="h-1 xl:h-0">
              {error && <p className="text-[#99182C] xl:fixed">{error}</p>}
              </div>
          

          <div className="xl:fixed xl:top-[80vh] ">
            <div className="xl:flex xl:justify-between flex justify-between">
              <button
                type="button"
                onClick={() => {
                  const formData = {
                    complete_address: completeAddress,
                    main_phone_number: mainPhoneNumber,
                    emergency_phone_number: emergencyPhoneNumber,
                    email_address: emailAddress
                  }; 
                  updateFormData(formData);
                  onBack();
                }}
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
            <div className="flex gap-5 text-[32px]">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 2 ? 'border-[#5C69F8] text-black' : 'text-black bg-white border-none'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative top-36 left-[43.7%]" src={lineIcon} alt="" />
            <img className="relative top-[80%] left-[43.7%]" src={lineIcon} alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y4">
              <img 
                src={contactIcon} 
                alt="Contact Icon" 
                className="h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[500] font-Montserrat">Contact & Location</h2>
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
}

export default ContactInfo;