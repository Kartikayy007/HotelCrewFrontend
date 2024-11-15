import React from "react";
import StaffDB from "./DB components/StaffDB";
import CustomerDB from "./DB components/CustomerDB";
import {Search} from "lucide-react";

function DataBase() {
  const [activeComponent, setActiveComponent] = React.useState("StaffDB");

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <div>
        <div>
          <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12 text-[#252941]">
            Database
          </h1>
        </div>
        <div className="filters flex justify-center mb-5">
          <div className="filter-buttons flex justify-between gap-8 items-center w-full max-w-7xl">
            <h1 className="text-2xl font-medium [#F1F6FC]space-nowrap">Filters</h1>
            
            <div className="flex-1 mx-8 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {activeComponent === "StaffDB" && (
                  <>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full ">
                      <option value="All">Departments</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales">Sales</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2 ">
                      <option value="All">Role</option>
                      <option value="Manager">Manager</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Staff">Staff</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full  mr-2 ">
                      <option value="All">Shift</option>
                      <option value="Morning">Day Shift</option>
                      <option value="Night">Night Shift</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2 ">
                      <option value="All">Performance</option>
                      <option value="1">1 stars & up</option>
                      <option value="2">2 stars & up</option>
                      <option value="3">3 stars & up</option>
                      <option value="4">4 stars & up</option>
                      <option value="5">5 stars & up</option>
                      <option value="6">6 stars & up</option>
                      <option value="7">7 stars & up</option>
                      <option value="8">8 stars & up</option>
                      <option value="9">9 stars & up</option>
                      <option value="10">10</option>
                    </select>
                  </>
                )}
                {activeComponent === "CustomerDB" && (
                  <>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full ">
                      <option value="All">Customer Type</option>
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                      <option value="New">New</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2 ">
                      <option value="All">Booking Status</option>
                      <option value="Confirmed">Active</option>
                      <option value="Pending">Upcoming</option>
                      <option value="Cancelled">Completed</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2 ">
                      <option value="All">Stay Duration</option>
                      <option value="1-3">1-3 days</option>
                      <option value="4-7">4-7 days</option>
                      <option value="8-14">8-14 days</option>
                      <option value="15+">15+ days</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2 ">
                      <option value="All">Feedback Rating</option>
                      <option value="1">1 star & up</option>
                      <option value="2">2 stars & up</option>
                      <option value="3">3 stars & up</option>
                      <option value="4">4 stars & up</option>
                      <option value="5">5 stars & up</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            <div className="relative min-w-[320px] ">
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#F1F6FC] hover:bg-gray-300 w-full text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col ">
          <div>
            <button
              className={`${
                activeComponent === "StaffDB"
                  ? "bg-[#252941] text-[#F1F6FC]"
                  : "bg-[#B7CBEA] text-[#252941]"
              } font-medium py-2 px-4 rounded-t-lg`}
              onClick={() => setActiveComponent("StaffDB")}
            >
              Staff
            </button>
            <button
              className={`${
                activeComponent === "CustomerDB"
                  ? "bg-[#252941] text-[#F1F6FC]"
                  : "bg-[#B7CBEA] text-[#252941]"
              } font-medium py-2 px-4 rounded-t-lg`}
              onClick={() => setActiveComponent("CustomerDB")}
            >
              Customer
            </button>
          </div>
        <div>
          
        {activeComponent === "StaffDB" ? <StaffDB /> : <CustomerDB />}
        </div>
        </div>
      </div>
    </section>
  );
}

export default DataBase;
