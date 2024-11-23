import React, { useState, ChangeEvent } from 'react'

interface FileReaderEvent extends ProgressEvent {
  target: FileReader;
}

function Profile() {
  const [profileImage, setProfileImage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = event.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.onerror = () => {
        setError("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">Settings</h1>

      <div className="bg-white rounded-2xl shadow-lg w-[95%] sm:w-[90%] md:w-[85%] lg:mx-12 mx-auto">
        <section className="lg:h-[85vh]  h-full p-2 mr-4 font-Montserrat">
          <div className="lg:mt-1 mt-2 ml-4 mr-2 pt-2 pb-1 pr-7 pl-7 rounded-lg">
        <div className="lg:flex-row flex-col flex w-full lg:items-start items-center lg:justify-evenly h-[85vh]">
          <div
            className="relative mt-4 w-32 h-32 lg:w-60 lg:h-60 lg:top-14 rounded-full border border-gray-400 cursor-pointer"
            style={{padding: "6.18px"}}
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            <img
          src={profileImage || "/default-profile.png"}
          alt="profile"
          className="w-full h-full rounded-full object-cover"
            />
            <img
          src="/tabler_edit.svg"
          alt="edit"
          className="absolute bottom-3 right-8 lg:w-10 lg:h-10 w-7 h-7 cursor-pointer z-10"
            />
            <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{display: "none"}}
          id="imageUpload"
            />
            {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
          
          <div className="relative w-full lg:w-auto pl-4 lg:pl-8 mt-4">
            <h2 className="text-[#000000] text-xl mt-5 font-semibold">
          Personal Details
            </h2>

            <form className="lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10">
          <div className="flex lg:flex-row flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="font-semibold text-sm">
            First Name
              </label>
              <input
            type="text"
            id="firstName"
            className="border border-gray-400 rounded-[4px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="font-semibold text-sm">
            Last Name
              </label>
              <input
            type="text"
            id="lastName"
            className="border border-gray-400 rounded-[4px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-sm">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-400 rounded-[4px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h2 className="text-[#000000] text-xl font-semibold">
            Account Details
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="accountNumber" className="font-semibold text-sm">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              className="border border-gray-400 rounded-[4px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex lg:justify-end justify-center">
            <button
              type="submit"
              className="mt-2 mb-6 w-[195px] rounded-2xl text-white font-semibold p-1 bg-[#3F4870] hover:bg-[#2d355c] transition-colors"
            >
              Save Changes
            </button>
          </div>
            </form>
          </div>
        </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Profile
