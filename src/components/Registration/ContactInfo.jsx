import React, { useState, useEffect } from "react";

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Format data to match API structure
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
    // Allow only numbers and limit to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setter(value);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex justify-center items-center gap-9 ml-[5.1rem]">
        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[550]">Contact & Location</h1>
          </div>

          <div>
            <label
              htmlFor="complete-address"
              className="block text-sm font-sans font-[450]"
            >
              Complete Address*
            </label>
            <input
              type="text"
              id="complete-address"
              value={completeAddress}
              onChange={(e) => setCompleteAddress(e.target.value)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label
              htmlFor="phone-number"
              className="block text-sm font-sans font-[450] text-gray-700 mb-1"
            >
              Phone Numbers*
            </label>

            <input
              type="tel"
              id="main-phone"
              value={mainPhoneNumber}
              onChange={(e) => handleNumberInput(e, setMainPhoneNumber)}
              className="h-8 w-[299px] mr-6 py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder="Main number"
              maxLength={10}
            />

            <input
              type="tel"
              id="emergency-phone"
              value={emergencyPhoneNumber}
              onChange={(e) => handleNumberInput(e, setEmergencyPhoneNumber)}
              className="h-8 w-[299px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder="Emergency number"
              maxLength={10}
            />
          </div>

          <div>
            <label
              htmlFor="hotel-email"
              className="block text-sm font-sans font-[450] mb-1"
            >
              Hotel Email*
            </label>
            <input
              type="email"
              id="hotel-email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="h-8 w-[623px] py-2 px-4 border border-[#BDBDBD] rounded-lg focus:outline-none"
              placeholder="hotel@example.com"
            />
          </div>

          {error && <p className="text-red-500 fixed">{error}</p>}

          <div className="relative top-24">
            <div className="flex justify-between">
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
                className="h-9 w-[7rem] bg-gray-400 font-Montserrat font-[700] rounded-lg text-white"
              >
                <span>Back </span>
              </button>
              <button
                onClick={handleNextClick}
                className="h-9 w-[7rem] bg-[#5663AC] font-Montserrat font-[700] rounded-lg top-10 text-white"
              >
                <span>Next </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </form>

        <div>
          <div className="w-[515px] relative left-[35%] h-[100vh] bg-white shadow-2xl border-none rounded-lg overflow-hidden">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 2
                      ? "border-[#5C69F8] text-black"
                      : "text-black bg-white"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img
              className="relative top-36 left-[43.7%]"
              src="src/assets/Line.svg"
              alt=""
            />
            <img
              className="relative top-[80%] left-[43.7%]"
              src="src/assets/Line.svg"
              alt=""
            />

            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src="src/assets/contact.svg"
                alt="Hotel Icon"
                className="h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">
                Contact & Location
              </h2>
              <p className="text-gray-600 font-sans font-[300] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[300]">
                  You can always edit the data in the
                </span>
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