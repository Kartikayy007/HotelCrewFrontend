import React, {useState} from "react";
import {Plus, Trash2, Clock, Upload} from "lucide-react";
import docupload from "/docupload.svg";

const BasicInfo = () => {
  return (
    <section className="bg-white rounded-3xl p-8 lg:h-[75vh] mx-5 h-full shadow-sm lg:w-2/3">
      <h2 className="text-xl font-bold mb-8">Basic Information</h2>

      <div className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="hotelName" className="text-sm font-medium mb-2">
            Hotel Name
          </label>
          <input
            type="text"
            id="hotelName"
            placeholder="Hotel Name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="legalName" className="text-sm font-medium mb-2">
            Legal Business Name (optional)
          </label>
          <input
            type="text"
            id="legalName"
            placeholder="Legal Business Name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="yearEstablished" className="text-sm font-medium mb-2">
            Year Established*
          </label>
          <input
            type="text"
            id="yearEstablished"
            placeholder="YYYY"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="licenseNumber" className="text-sm font-medium mb-2">
            License Number
          </label>
          <input
            type="text"
            id="licenseNumber"
            placeholder="License Number"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = () => {
  return (
    <section className="bg-white rounded-3xl mx-5 lg:h-[75vh] h-full p-8 shadow-sm lg:w-2/3">
      <h2 className="text-xl font-bold mb-8">Contact Information</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Complete Address*
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number*
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Main number"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Emergency number"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Hotel E-mail*
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

const PropertyDetails = () => {
  const [roomTypes, setRoomTypes] = useState([]);

  const addRoomType = () => {
    setRoomTypes([...roomTypes, {type: "", count: ""}]);
  };

  const removeRoomType = (index) => {
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white mx-5 lg:h-[75vh] h-full rounded-3xl p-8 shadow-sm lg:w-2/3">
      <h2 className="text-xl font-bold mb-8">Property Details</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Rooms
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Types of Rooms</label>
            <button
              onClick={addRoomType}
              className="text-gray-600 hover:text-gray-800"
            >
              <Plus size={24} />
            </button>
          </div>

          {roomTypes.map((room, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center">
              <input
                type="text"
                placeholder="Type of Room"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Number of Rooms"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeRoomType(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Floors
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Valet Parking Available</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Parking Capacity
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

const StaffManagement = () => {
  const [departments, setDepartments] = useState([
    "Housekeeping",
    "Security",
    "Kitchen",
  ]);

  const addDepartment = () => {
    setDepartments([...departments, ""]);
  };

  const removeDepartment = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white mx-4 lg:h-[75vh] h-full rounded-3xl p-8 shadow-sm lg:w-2/3 ">
      <h2 className="text-xl font-bold mb-8">Staff Management</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Departments</label>
            <button
              onClick={addDepartment}
              className="text-gray-600 hover:text-gray-800"
            >
              <Plus size={24} />
            </button>
          </div>
          {departments.map((department, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center">
              <input
                type="text"
                value={department}
                onChange={(e) => {
                  const newDepartments = [...departments];
                  newDepartments[index] = e.target.value;
                  setDepartments(newDepartments);
                }}
                placeholder="Department name"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeDepartment(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

const OperationalInfo = () => {
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([""]);

  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, ""]);
  };

  const removePaymentMethod = (index) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white lg:h-[75vh] h-full rounded-3xl p-8 shadow-sm w-2/3 mx-4">
      <h2 className="text-xl font-bold mb-8">Operational Information</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Check-in Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Clock
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Check-out Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Clock
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Payment Methods</label>
            <button
              onClick={addPaymentMethod}
              className="text-gray-600 hover:text-gray-800"
            >
              <Plus size={24} />
            </button>
          </div>
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center">
              <input
                type="text"
                value={method}
                onChange={(e) => {
                  const newMethods = [...paymentMethods];
                  newMethods[index] = e.target.value;
                  setPaymentMethods(newMethods);
                }}
                placeholder="Add payment method"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removePaymentMethod(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

const StaffData = () => {
  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  return (
    <section className="bg-white lg:h-[75vh] h-full rounded-3xl p-8 shadow-sm lg:w-2/3 mx-4">
      <h2 className="text-xl font-bold mb-8">Staff Data</h2>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-[#EFEFEF] h-1/2 flex flex-col justify-center items-center"
      >
        <p className="text-sm text-gray-600 mb-4">
          Drag Documents from computer or upload from drive
        </p>
        <div className="mb-4 flex justify-center item-center">
          <img src={docupload} alt="" />
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-[#5663AC] text-white px-6 py-2 rounded-lg hover:bg-[#374160] transition-colors cursor-pointer inline-block w-32"
        >
          Upload
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors">
          Save Changes
        </button>
      </div>
    </section>
  );
};

const Profile = () => {
  const [profileImage, setProfileImage] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="lg:h-[75vh] h-full p-2 mr-4 font-Montserrat">
      <div className="lg:mt-1 mt-2 ml-4 mr-2 pt-2 pb-1 pr-7 pl-7 rounded-lg">
        <div className="lg:flex-row flex-col flex w-full lg:items-start items-center lg:justify-evenly">
          <div
            className="relative mt-4 w-48 h-48 lg:w-60 lg:h-60 lg:top-14 rounded-full border border-gray-400 cursor-pointer"
            style={{padding: "6.18px"}}
            onClick={() => document.getElementById("imageUpload").click()}
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
          </div>
          <div className="relative w-full lg:w-auto  pl-4 lg:pl-8 mt-4">
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
                    className="border border-gray-400 rounded-[4px] px-2 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="font-semibold text-sm">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="border border-gray-400 rounded-[4px] px-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold text-sm">
                  E-mail
                </label>
                <input
                  type="text"
                  id="email"
                  className="border border-gray-400 rounded-[4px] px-2 focus:outline-none"
                />
              </div>

              <h2 className="text-[#000000] text-xl  font-semibold">
                Account Details
              </h2>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="accountNumber"
                  className="font-semibold text-sm"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  className="border border-gray-400 rounded-[4px] px-2 focus:outline-none"
                />
              </div>

              <div className="flex lg:justify-end justify-center">
                <button
                  type="submit"
                  className="mt-2 mb-6 w-[195px] rounded-2xl text-white font-semibold  p-1 bg-[#3F4870]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {id: "profile", label: "Profile"},
    {id: "basicInfo", label: "Basic Info"},
    {id: "contactInfo", label: "Contact Info"},
    {id: "propertyDetails", label: "Property Details"},
    {id: "staffManagement", label: "Staff Management"},
    {id: "operationalInfo", label: "Operational Info"},
    {id: "staffData", label: "Staff Data"},
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "basicInfo":
        return <BasicInfo />;
      case "contactInfo":
        return <ContactInfo />;
      case "propertyDetails":
        return <PropertyDetails />;
      case "staffManagement":
        return <StaffManagement />;
      case "operationalInfo":
        return <OperationalInfo />;
      case "staffData":
        return <StaffData />;
      default:
        return <Profile />;
    }
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Settings
      </h1>

      <div className="mb-6 mt-6">
        <div>
          <nav className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-[#252941] text-[#F1F6FC]"
                    : "bg-[#B7CBEA] text-[#252941]"
                } font-medium py-2 px-4 rounded-t-lg mr-1 mb-1`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-tr-lg rounded-b-lg shadow lg:w-[75vw] -mt-7">{renderContent()}</div>
    </section>
  );
};

export default AdminSettings;
