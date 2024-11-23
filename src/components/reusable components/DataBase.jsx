import React, {useState, useRef, useEffect} from "react";
import StaffDB from "./DB components/StaffDB";
import CustomerDB from "./DB components/CustomerDB";
import {Search, ChevronLeft, ChevronRight} from "lucide-react";

function DataBase() {
  const [activeComponent, setActiveComponent] = React.useState("StaffDB");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <div className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw]">
        <div>
          <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12 text-[#252941] mb-2">
            Database
          </h1>
        </div>
        <div className="filters flex justify-start md:justify-center mb-5">
          <div className="filter-buttons flex flex-col lg:flex-row gap-2 items-center w-full max-w-7xl">
            <h1 className="text-2xl font-medium space-nowrap text-start lg:block hidden">
              Filters
            </h1>

            <div className="flex-1 w-full mx-8 relative">
              {showLeftArrow && (
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 lg:hidden bg-white/80 rounded-full shadow-md p-1 hover:bg-white"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="w-5 h-5 text-[#5663AC]" />
                </button>
              )}

              <div
                ref={scrollContainerRef}
                className="scroll-container flex gap-2 overflow-x-auto hide-scrollbar w-full"
              >
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
                  </>
                )}
                {activeComponent === "CustomerDB" && (
                  <>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full ">
                      <option value="All">Customer Type</option>
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                    </select>
                    <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2 ">
                      <option value="All">Booking Status</option>
                      <option value="Confirmed">Active Customer</option>
                      <option value="past">Past Customer</option>
                    </select>
                  </>
                )}
              </div>

              {showRightArrow && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 lg:hidden bg-white/80 rounded-full shadow-md p-1 hover:bg-white"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="w-5 h-5 text-[#5663AC]" />
                </button>
              )}
            </div>

            <div className="relative lg:w-2/6 w-full">
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#F1F6FC] hover:bg-gray-300 w-full text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
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
