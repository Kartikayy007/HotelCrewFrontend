import React, { useState, useEffect } from "react";

function ContactInfo({ onNext, onBack, updateFormData, initialData }) {
  const [address, setAddress] = useState("");
  const [mainPhone, setMainPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (initialData) {
      setAddress(initialData.address || "");
      setMainPhone(initialData.mainPhone || "");
      setEmergencyPhone(initialData.emergencyPhone || "");
      setEmail(initialData.email || "");
    }
  }, [initialData]);

  const handleNextClick = (e) => {
    e.preventDefault();
    const formData = {
      address,
      mainPhone,
      emergencyPhone,
      email,
    };

    updateFormData(formData);
    onNext();
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden ">
      <div className="flex flex-col lg:flex-row  justify-center items-center gap-9 lg:ml-[5.1rem]">
      <div className="flex lg:hidden absolute top-[63px] gap-3 mb-4">
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

        {/* Mobile Content Block */}
        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src="src/assets/contact.svg"
            alt="Hotel Icon"
            className="h-[96] mb-4 text-[#5663AC]"
          />
          <h2 className="text-[24px] font-[500] font-Montserrat">
            Contact & Location
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
            <h1 className="text-[32px] font-medium hidden lg:block">Contact & Location</h1>
          </div>

          <div>
            <label
              htmlFor="complete-address"
              className="block text-sm font-sans font-[600]"
            >
              Complete Address
            </label>
            <input
              type="text"
              id="complete-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-8 lg:w-[623px] w-[380px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="phone-number"
              className="block text-sm font-sans font-[600]  mb-1"
            >
              Phone Number
            </label>

            <input
              type="text"
              id="main-phone"
              value={mainPhone}
              onChange={(e) => setMainPhone(e.target.value)}
              className="h-8 lg:w-[299px] w-[178px] mr-6 py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none text-xs"
              placeholder="Main number"
            />

            <input
              type="text"
              id="emergency-phone"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="h-8 lg:w-[299px] w-[178px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none text-xs"
              placeholder="Emergency number"
            />
          </div>

          <div>
            <label
              htmlFor="hotel-email"
              className="block text-sm font-sans font-[600] mb-1"
            >
              Hotel E-mail
            </label>
            <input
              type="text"
              id="hotel-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-8 lg:w-[623px] w-[380px] py-2 px-4 border border-[#BDBDBD] rounded-[4px] focus:outline-none text-xs"
            />
          </div>

          <div className="relative top-24">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  const formData = {
                    address,
                    mainPhone,
                    emergencyPhone,
                    email,
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
                className="h-9 w-[7rem] bg-[#5663AC] font-Montserrat font-[700] rounded-lg top-10  text-white"
              >
                <span>Next </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </form>

        <div >
          <div className="hidden lg:block lg:w-[515px] w-full relative font-medium left-[26%] h-[40vh] lg:h-[100vh] bg-white lg:shadow-2xl border-none rounded-lg ">
            <div className="flex gap-5 text-2xl items-center ">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-14 font-medium left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 2
                      ? "border-[#5C69F8] text-black"
                      : "text-black bg-white border-none"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img
              className="hidden lg:block relative top-36 left-[43.7%]"
              src="src/assets/Line.svg"
              alt=""
            />
            <img
              className="hidden lg:block relative top-[80%] left-[43.7%]"
              src="src/assets/Line.svg"
              alt=""
            />

            <div className="flex flex-col items-center justify-center h-full space-y-4 ">
              <img
                src="src/assets/contact.svg"
                alt="Hotel Icon"
                className=" h-[96] mb-4 text-[#5663AC]"
              />
              <h2 className="text-[24px] font-[500] font-Montserrat">
                Contact & Location
              </h2>
              <p className=" font-sans font-[400] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[400]">
                  {" "}
                  You can always edit the data in the{" "}
                </span>
                <br />
                <span className="font-sans font-[400]"> setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactInfo;