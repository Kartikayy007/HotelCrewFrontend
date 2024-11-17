import { useState, useEffect } from "react";
import * as React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import {LineChart} from "@mui/x-charts/LineChart";
import { BarChart } from '@mui/x-charts/BarChart';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceStats } from '../../redux/slices/AttendanceSlice';

const Dash = () => {
  const dispatch = useDispatch();
  const togglePriority = () => {
    setIsPriority(!isPriority);
  };
  const [isPriority, setIsPriority] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const departments = [
    { value: '', label: 'Select Department', disabled: true },
    { value: 'security', label: 'Security' },
    { value: 'housekeeping', label: 'HouseKeeping' },
  ];
  const [selected, setSelected] = useState(departments[0]);
  const { stats, loading, error } = useSelector((state) => state.attendance);
  useEffect(() => {
    dispatch(fetchAttendanceStats());
    
    const interval = setInterval(() => {
      dispatch(fetchAttendanceStats());
    }, 300000);
  
    return () => clearInterval(interval);
  }, [dispatch]);

  const roomData = [
    {id: 0, value: 60, label: "Occupied", color: "#252941"}, // Green color
    {id: 1, value: 30, label: "Vacant", color: "#8094D4"}, // Red color
    {id: 2, value: 10, label: "Maintainence", color: "#6B46C1"}, // Red color
  ];

  const staffStatus = [
    {id: 0, value: 45, label: "Busy", color: "#252941"},
    {id: 1, value: 35, label: "Vacant", color: "#8094D4"},
  ];

  // const staffAttendance = [
  //   {id: 0, value: 90, label: "Present", color: "#252941"},
  //   {id: 1, value: 7, label: "Absent", color: "#8094D4"},
  //   {id: 2, value: 3, label: "On Leave", color: "#6B46C1"},  
  // ];
  const staffAttendanceData = [
    {
      id: 0,
      value: stats.totalPresent || 0,
      label: 'Present',
      color: '#252941',
    },
    {
      id: 1,
      value: stats.totalCrew - stats.totalPresent || 0,
      label: 'Absent',
      color: '#8094D4',
    },
  ];
  const performanceData = {
    xAxis: [
      {
        id: "staff",
        data: ["John", "Jane", "Bob", "Alice", "Tom"],
        scaleType: "band",
      },
    ],
    series: [
      {
        type: "bar",
        data: [88, 92, 85, 95, 89],
        color: "#2A2AA9",
      },
    ],
  };[]
  const inOutData={
    xAxis:[
      {
        data: ["Mon", "Tue", "Wed", "Thus", "Fri","Sat","Sun"],
        scaleType: "band",
        categoryGapRatio: 0.5
        
      }
    ],
    series:[
      
      {
        id:"checkin",
        type: "bar",
        data: [40, 92, 85, 60, 58,60,90],
        color: "#8094D4",
       
        label:"Check-in",
      },
      {
        id:"checkout",
        type: "bar",
        data: [70, 40, 49, 25, 89,50,70],
        color: "#2A2AA9",
        
        label:"Check-out"
      }
    ]
  }
  const revenueData = {
    xAxis: [
      {
        id: "months",
        data: ["mon", "tue", "wed", "thus", "fri", "sat", "sun"],
        scaleType: "band",
      },
    ],
    
    series: [
      {
        data: [2400, 1398, 9800, 3908, 2800, 2800, 0],
        curve: 'linear',
        color: "#6B46C1",
        highlightScope: {
          highlighted: 'none',
          faded: 'global'
        },
        
      },
    ],
  };



  const handleSelect = (dept) => {
    setSelected(dept);
    setIsDropdownOpen(false);
  };
  

  return (
    <section className=" h-screen p-2 mr-4 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-3 mt-4 font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] gap-5 p-3">
      
         {/* First Column */}
         <div className="space-y-5">
        
        <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
          <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Hotel Status</h2>
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
                <h3 className="font-medium mb-4 ">Room Status</h3>
                <PieChart
                  series={[
                    {
                      data: roomData,
                      highlightScope: {fade: "global", highlight: "item"},
                      innerRadius: 45,
                      paddingAngle: 1,
                      cornerRadius: 1,
                    },
                  ]}
                  height={220}
                  width={250}
                  margin={{top: 0, bottom: 40, left: 0, right: 0}}
                  slotProps={{
                    legend: {
                      hidden:true,
                      // direction: "row",
                      // position: { vertical: "bottom", horizontal: "center" },
                      // padding: 0,
                      // markSize: 5,
                      // itemGap: 4,
                      // labelStyle: {
                      //   fontSize: 11,
                      //   fontWeight: 500
                      // }
                    }
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">Staff status</h3>
                <PieChart
                  series={[
                    {
                      data: staffStatus,
                      highlightScope: {fade: "global", highlight: "item"},
                      innerRadius: 45,
                      paddingAngle: 1,
                      cornerRadius: 1,
                    },
                  ]}
                  height={220}
                  width={250}
                  margin={{top: 0, bottom: 40, left: 0, right: 0}}
                  slotProps={{
                    legend: {
                      hidden:true,
                    //   direction: "row",
                    //   position: { vertical: "bottom", horizontal: "center" },
                    //   padding: 0,
                    //   markSize: 10,
                    //   itemGap: 15,
                    //   labelStyle: {
                    //     fontSize: 15,
                    //     fontWeight: 500
                    //   }
                    }
                  }}
                  
                />
              </div>

              <div className="text-center">
                <h3 className="font-medium mb-2">Staff Attendance</h3>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <PieChart
                    series={[
                      {
                        data: staffAttendanceData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        innerRadius: 45,
                        paddingAngle: 1,
                        cornerRadius: 1,
                      },
                    ]}
                    height={220}
                    width={250}
                    margin={{ top: 0, bottom: 40, left: 0, right: 0 }}
                    slotProps={{
                      legend: {
                        hidden: true,
                      },
                    }}
                  />
                )}
              </div>
            </div>

        </div>
        <div className="bg-white rounded-lg shadow  w-full p-4">
        <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Guest Flow Overview</h2>
        <BarChart 
        xAxis={inOutData.xAxis}
        series={inOutData.series}
        margin={{top: 20, right: 5, bottom: 28, left: 47}}
        height={250}
        slotProps={{ legend: { hidden: true } }}
        // barLabel={{hidden:true}}
        />
        </div>
        
        <div className="bg-white rounded-lg shadow  w-full p-4">
            <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Revenue</h2>
            <LineChart
              xAxis={revenueData.xAxis}
              series={revenueData.series}
              height={250}
              margin={{top: 20, right: 5, bottom: 28, left: 47}}
              sx={{
                ".MuiLineElement-root": {
                  strokeWidth: 2,
                },
              }}
            /> 
          </div>
        </div>
         {/* Second Column */}
         <div className="space-y-5">
         {/* <div className="bg-white rounded-lg shadow  w-full p-4">
        <div className="flex flex-col space-y-6 w-full  mt-6 lg:mt-0">
          
            <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Staff's Performance</h2>
            <BarChart
              xAxis={performanceData.xAxis}
              series={performanceData.series}
              height={300}
              margin={{top: 10, right: 20, bottom: 30, left: 40}}
            />
          </div>
        
        </div>
         */}
         <div className="w-full ">
        <div className="bg-white  h-[50%] p-4 pr-6 pl-6 shadow rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#3f4870] text-lg font-semibold mb-2">Task Assignment</h2>
          <div
          className={`cursor-pointer ${isPriority ? 'text-gold' : 'text-gray-200'}`}
          onClick={togglePriority}
        >
          {isPriority ? (
            <FaStar size={25} color="gold" />
          ) : (
            // <FaRegStar size={25} color="gray" />
            <p className="text-gray-400">Mark Priority</p>
          )}
        </div>
        </div>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task Title"
              className=" border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
            />
            {/* <select
              type="text"
              placeholder="Department"
              className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none "
            >
              <option value="" disabled>Select Department</option>
              <option value="security">Security</option>
              <option value="housekeeping">HouseKeeping</option>
            </select> */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selected.value ? 'text-black' : 'text-gray-400'} focus:outline-none flex justify-between items-center`}
              >
                {selected.label}
                {isDropdownOpen ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                  {departments.map((dept, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelect(dept)}
                      disabled={dept.disabled}
                      className={`w-full text-left px-4 py-2 ${dept.disabled ? 'text-gray-400 cursor-default' : 'text-black hover:bg-gray-100'}`}
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <textarea
              name="taskDescription"
              id="taskDescription"
              placeholder="Task Description"
              maxLength={350}
              className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 h-[150px] resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
            ></textarea>
            <div className="flex justify-end">
              <button
                // onClick={handleAssign} 
                className="h-9 w-28 lg:w-full  bg-[#252941] font-Montserrat font-bold rounded-lg text-white"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
        </div>
        <div className="bg-white rounded-lg shadow  w-full p-4">
            <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Announcements</h2>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium">Monthly Staff Meeting</h3>
                <p className="text-sm text-gray-600">
                  Schedule changed to 3 PM
                </p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">New Safety Guidelines</h3>
                <p className="text-sm text-gray-600">
                  Updated protocols available
                </p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">System Maintenance</h3>
                <p className="text-sm text-gray-600">
                  Scheduled for next weekend
                </p>
              </div>
            </div>
            </div>
            <div className="bg-white rounded-lg shadow h-80 w-full p-4">
            <h2 className="text-[#3f4870] text-lg font-semibold mb-4">Leave Management</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-4">
                <h3 className="font-medium">Pending Requests</h3>
                <p className="text-2xl font-bold mt-2">5</p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-medium">Approved Leaves</h3>
                <p className="text-2xl font-bold mt-2">12</p>
              </div>
            </div>
            </div>
        
        


      </div>
      {/* </div> */}
      </div>
    </section>
  )
}

export default Dash;