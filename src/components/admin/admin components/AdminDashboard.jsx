import React, {useState} from "react";
import {PieChart} from "@mui/x-charts/PieChart";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";

function AdminDashboard() {
  const hours = new Date().getHours();

  const occupancyData = [
    {id: 0, value: 65, label: "Occupied", color: "#252941"}, 
    {id: 1, value: 135, label: "Vacant", color: "#8094D4"}, 
    {id: 2, value: 110, label: "On Break", color: "#6B46C1"},

  ];

  const staffStatus = [
    {id: 0, value: 45, label: "Busy", color: "#252941"},
    {id: 1, value: 35, label: "Vacant", color: "#8094D4"},
  ];

  const staffAttendance = [
    {id: 0, value: 60, label: "Present", color: "#252941"},
    {id: 1, value: 40, label: "Absent", color: "#8094D4"},

    {id: 2, value: 10, label: "On Leave", color: "#6B46C1"}, 
  ];

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
  };

  const greeting =
    hours < 12
      ? "Good Morning"
      : hours < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll">
      <h1 className="text-3xl font-semibold p-4 sm:p-8 lg:ml-8 ml-12">
        {greeting}
      </h1>

      <div className="flex flex-col lg:flex-row justify-around mx-4 sm:mx-8">
        <div className="flex flex-col space-y-6 w-full lg:w-4/6 mb-6 lg:mb-9">
          <div className="bg-white rounded-lg shadow h-80 w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Hotel Status</h2>
            </div>

            <div className="flex justify-between px-4">
              <div className="text-center">
                <h3 className="font-medium mb-2 ">Occupancy Rate</h3>
                <PieChart
                  series={[
                    {
                      data: occupancyData,
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
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "center" },
                      padding: 0,
                      markSize: 10,
                      itemGap: 15,
                      labelStyle: {
                        fontSize: 12,
                        fontWeight: 500
                      }
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
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "center" },
                      padding: 0,
                      markSize: 10,
                      itemGap: 15,
                      labelStyle: {
                        fontSize: 15,
                        fontWeight: 500
                      }
                    }
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="font-medium mb-2">Staff Attendance</h3>
                <PieChart
                  series={[
                    {
                      data: staffAttendance,
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
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "center" },
                      padding: 0,
                      markSize: 10,
                      itemGap: 10,
                      labelStyle: {
                        fontSize: 13,
                        fontWeight: 500
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow h-80 w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Revenue</h2>
            <LineChart
              xAxis={revenueData.xAxis}
              series={revenueData.series}
              height={250}
              margin={{top: 20, right: 20, bottom: 30, left: 40}}
              sx={{
                ".MuiLineElement-root": {
                  strokeWidth: 2,
                },
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow h-80 w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Leave Management</h2>
            <div className="grid grid-cols-2 gap-4">
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

        <div className="flex flex-col space-y-6 w-full lg:w-[30%] mt-6 lg:mt-0">
          <div className="bg-white rounded-lg shadow h-[26rem] w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Staff's Performance</h2>
            <BarChart
              xAxis={performanceData.xAxis}
              series={performanceData.series}
              height={350}
              margin={{top: 10, right: 20, bottom: 30, left: 40}}
            />
          </div>

          <div className="bg-white rounded-lg shadow h-56 w-full p-4 relative">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <div className="text-sm text-gray-600">

            </div>
          </div>

          <div className="bg-white rounded-lg shadow h-80 w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Announcements</h2>
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
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
