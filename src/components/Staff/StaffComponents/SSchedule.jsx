import { useState, React, useRef,useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaPaperclip, FaCalendarAlt } from "react-icons/fa";
import { Snackbar,Skeleton, Alert } from "@mui/material";

const SSchedule = () => {
  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading,setLoading]=useState(true);
  const today = new Date();

  useEffect(() => {
    setTimeout(() => {

      setLoading(false);
    }, 1500);

  }, []);
  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };

  const toggleStartDropdown = () => {
    setIsStartDropdownOpen((prev) => !prev);
    if (!isStartDropdownOpen) {
      setIsEndDropdownOpen(false); // Close end date if start is opened
    }
  };

  const toggleEndDropdown = () => {
    setIsEndDropdownOpen((prev) => !prev);
    if (!isEndDropdownOpen) {
      setIsStartDropdownOpen(false); // Close start date if end is opened
    }
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null); // Reset the end date if it's before the new start date
    }
    setIsStartDropdownOpen(false); // Close the dropdown
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setIsEndDropdownOpen(false); // Close the dropdown
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };
  const handleRemoveFile = () => {
    setFileName(''); // Clear the file name when "X" is clicked
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setSnackbar({ open: true, message: "File uploaded successfully.", severity: "success" });
        setFileName(file.name);
        setTimeout(() => {
          handleCloseSnackbar(); // Close snackbar after 3 seconds
        }, 3000);
      } else {
        setSnackbar({ open: true, message: "Invalid file type. Please upload a PDF, JPG, or PNG file.", severity: "error" });
        event.target.value = ""; // Clear the input
        setTimeout(() => {
          handleCloseSnackbar(); // Close snackbar after 3 seconds
        }, 3000);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const shifts = ["morning", "day", "night"];
  const shiftTime = (shift) => {
    if (shift === "morning") {
      return "05:00 AM to 01:00 PM";
    } else if (shift === "day") {
      return "01:00 PM to 09:00 PM";
    } else if (shift === "night") {
      return "09:00 PM to 05:00 AM";
    } else {
      return "Invalid shift"; // Handle invalid inputs
    }
  };
  const attendance = [
    { date: "24/11/24", current_attendance: "Absent" },
    { date: "23/11/24", current_attendance: "Present" },
    { date: "22/11/24", current_attendance: "Present" },
    { date: "21/11/24", current_attendance: "Present" },
    { date: "20/11/24", current_attendance: "Present" },
    { date: "19/11/24", current_attendance: "Present" },
    { date: "18/11/24", current_attendance: "Absent" },
    { date: "17/11/24", current_attendance: "Present" },
    { date: "16/11/24", current_attendance: "Present" },
    { date: "15/11/24", current_attendance: "Present" },
    { date: "14/11/24", current_attendance: "Present" },
    { date: "13/11/24", current_attendance: "Present" },
    { date: "12/11/24", current_attendance: "Present" },
    { date: "11/11/24", current_attendance: "Present" },
  ]
  return (
    <section className=" min-h-screen py-2 mx-4 px-0 font-Montserrat overflow-auto">
      <h2 className="text-[#252941] text-3xl  my-3 pl-8 ml-5 font-semibold">Schedule Status</h2>
      {/* <div className="grid grid-cols-1  xl:grid-cols-[40%,35%,25%] gap-5 p-3 "> */}
      <div className="flex flex-col  xl:flex-row gap-5 p-3 ">
        <div className="space-y-5 xl:w-[40%]">
          <div className="bg-white w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-left">Shift Schedule</h2>
            {loading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={100}
                  {...skeletonProps}
                />
              </div>
            ) : (
            <div className='text-md text-[#47518C] font-semibold mb-2'>
              <p className='capitalize'>{shifts[0]}</p>
              <p className=''>Time: {shiftTime(shifts[0])}</p>
            </div>
            )}
          </div>

          <div className="bg-white w-full h-[70%] pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-left">Attendance</h2>
            <div className='h-[90%] mb-4 overflow-y-scroll rounded-lg'>
            {loading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={600}
                  {...skeletonProps}
                />
              </div>
            ) : (
              <table className="w-[96%]   px-1 mx-auto border border-[#dcdcdc] rounded-2xl shadow  ">
                {/* Table Headers */}
                <thead>
                  <tr className="bg-[#3F4870] text-[#E6EEF9] rounded-xl">

                    <th className="px-4 py-2 text-center">Date</th>
                    <th className="px-4 py-2 text-center">Attendance</th>

                  </tr>
                </thead>


                <tbody>
                  {attendance.map((member, index) => (
                    <tr
                      // key={member.date}
                      className={`px-4 py-2 ${index % 2 === 0 ? 'bg-[#F1F6FC]' : 'bg-[#DEE8FF]'
                        }`}
                    >
                      <td className="px-4 py-2 text-center">{member.date}</td>

                      <td className="px-4 py-2 text-center">
                        <button
                          className={`px-4 py-1 cursor-default rounded-full ${member.current_attendance === 'Present'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}

                        >
                          {member.current_attendance}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </div>
          </div>
        </div>
        <div className='space-y-5 xl:w-[35%]'>
          <div className="bg-white w-full xl:h-[85%] h-auto pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-left">Leave Request</h2>
            {loading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={670}
                  {...skeletonProps}
                />
              </div>
            ) : (
            <div >

              <form className='mt-8 h-full flex flex-col gap-3' >

                <input
                  type="text"
                  placeholder="Specify leave type"
                  maxLength={30}
                  // value={taskTitle}
                  // onChange={(e) => setTaskTitle(e.target.value)}
                  className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
                />

                <div className="flex lg:justify-between mt-3 gap-3">

                  <div className="relative lg:w-50 w-full">

                    <button
                      type="button"
                      onClick={toggleStartDropdown}
                      className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${startDate ? "text-black" : "text-gray-400"
                        } focus:outline-none flex justify-between items-center`}
                    >
                      {startDate
                        ? `Start :  ${startDate.toLocaleDateString()}`
                        : "Select a start date"}
                      {isStartDropdownOpen ? (
                        <FaChevronUp className="text-gray-600" />
                      ) : (
                        <FaChevronDown className="text-gray-600" />
                      )}
                      {/* <FaCalendarAlt className="text-gray-500 h-6" /> */}
                    </button>

                    {isStartDropdownOpen && (
                      <div className="absolute  z-50 ">
                        <DatePicker
                          selected={startDate}
                          onChange={handleStartDateChange}
                          inline
                          selectsStart
                          dateFormat="dd/MM/yyyy"
                          minDate={today}
                          startDate={startDate}
                          endDate={endDate}
                        />
                      </div>
                    )}
                  </div>


                  <div className="relative w-full lg:w-50">
                    <button
                      type="button"
                      onClick={toggleEndDropdown}
                      className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${endDate ? "text-black" : "text-gray-400"
                        } focus:outline-none flex justify-between items-center`}
                    >
                      {endDate
                        ? `End :  ${endDate.toLocaleDateString()}`
                        : "Select an end date"}
                      {isEndDropdownOpen ? (
                        <FaChevronUp className="text-gray-600" />
                      ) : (
                        <FaChevronDown className="text-gray-600" />
                      )}
                    </button>

                    {isEndDropdownOpen && (
                      <div className="absolute  z-50 pr-4 mr-5">
                        <DatePicker
                          selected={endDate}
                          onChange={handleEndDateChange}
                          inline
                          selectsEnd
                          dateFormat="dd/MM/yyyy"
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate || today} // Prevent selection of dates before the start date
                        />
                      </div>
                    )}
                  </div>

                </div>
                <div className="flex flex-col gap-4 mt-3">
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full  text-black focus:outline-none flex justify-between items-center gap-4"
                  >
                    <span className="text-gray-500">{fileName|| 'Attach File'}
                      {/* {fileName ? (
                        <>
                          {fileName} {/* Display the file name */}
                          {/* <button
                            type="button"
                            onClick={handleRemoveFile} // Remove the file when clicked
                            className="text-red-500 ml-2"
                          >
                            X
                          </button> */}
                        {/* </> */}
                      {/* ) : ( */}
                        {/* 'Attach File' */}
                      {/* )} */}
                    </span>
                    {fileName? (<button
                            type="button"
                            onClick={handleRemoveFile} // Remove the file when clicked
                            className="text-gray-500 ml-2 pr-2" >
                              X
                          </button>
                    ):(<FaPaperclip className="text-gray-500 h-6" />)
                    }
                    
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" // Hidden input field
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <div className='relative h-full'>
                  <textarea
                    // value={taskDescription}
                    // onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="State reason for leave  ..."
                    maxLength={400}
                    className="border border-gray-200 w-full my-3 rounded-xl bg-[#e6eef9] p-2 xl:h-[400px] h-[150px]  resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
                  />
                </div>
                <div className="flex justify-end mb-2">
                  <button
                    type="submit"
                    // disabled={Taskloading}
                    //onclick()=>{handleRequestSubmit}
                    className="h-9  w-full  bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white  shadow-xl"
                  >
                    Request
                    {/* {Taskloading ? "Assigning..." : "Assign"} */}
                  </button>
                </div>
              </form>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SSchedule