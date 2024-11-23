import React, {useState, useEffect} from "react";
import {Search, ChevronDown, ChevronLeft, ChevronRight} from "lucide-react";

const MAX_NAME_LENGTH = 20;

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

function AdminPayRoll() {
  const [employees, setEmployees] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({key: null, direction: "asc"});
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmployees([
          {
            id: 1,
            name: "dasdasd",
            email: "arjungupta@gmail.com",
            department: "Housekeeping",
            accountNumber: "5346765469",
            salary: "₹40,000",
          },
          {
            id: 2,
            name: "Arjun gupta",
            email: "arjungupta@gmail.com",
            department: "Housekeeping",
            accountNumber: "5346765469",
            salary: "₹423,000",
          },
          {
            id: 3,
            name: "Arjudawddawdawn Gupta",
            email: "arjungupta@gmail.com",
            department: "Housekeeping",
            accountNumber: "5346765469",
            salary: "₹42340,000",
          },
          {
            id: 4,
            name: "Arjun Gupdawdhawdbawhdhjabwdhta",
            email: "arjungupta@gmail.com",
            department: "Housekeeping",
            accountNumber: "5346765469",
            salary: "₹5540,000",
          },
          {
            id: 5,
            name: "Arddawdwadwadawkjdbawhbdhkawbdhkabwdhkbawhkdbjun Gupta",
            email: "arjungupta@gmail.com",
            department: "Housekeeping",
            accountNumber: "5346765469",
            salary: "₹44320,000",
          },
        ])
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSort = (key) => {
    if (key !== 'salary') return; 
  
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" 
        ? "desc" 
        : "asc",
    }));
  
    setEmployees((prevEmployees) => {
      return [...prevEmployees].sort((a, b) => {
        const aValue = parseFloat(a.salary.replace("₹", "").replace(/,/g, ""));
        const bValue = parseFloat(b.salary.replace("₹", "").replace(/,/g, ""));
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      });
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(employees.map((emp) => emp.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollAmount = clientWidth / 2;

      if (direction === 'left') {
        scrollContainerRef.current.scrollLeft = Math.max(0, scrollLeft - scrollAmount);
      } else {
        scrollContainerRef.current.scrollLeft = Math.min(maxScrollLeft, scrollLeft + scrollAmount);
      }

      setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
      setShowRightArrow(scrollContainerRef.current.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  return (
    <div className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Payroll
      </h1>

      {/* Filters Section */}
      <div className="mb-5 px-2 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <h2 className="text-xl font-medium hidden lg:block">
            Filters
          </h2>
          
          {/* Filter Dropdowns */}
          <div className="flex-1 w-full relative">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              <select className="min-w-[140px] bg-[#F1F6FC] hover:bg-gray-200 text-[#5663AC] font-medium py-2 px-4 rounded-full">
                <option value="All">Department</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
              </select>

              <select className="min-w-[140px] bg-[#F1F6FC] hover:bg-gray-200 text-[#5663AC] font-medium py-2 px-4 rounded-full">
                <option value="All">All Shift</option>
                <option value="day shift">Day Shift</option>
                <option value="night shift">Night Shift</option>
              </select>
            </div>
          </div>

          {/* Search and Continue Button */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F1F6FC] hover:bg-gray-200 text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC] w-5 h-5" />
            </div>
            
            <button className="bg-[#5663AC] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#4553a0] transition-colors">
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw] bg-white rounded-lg shadow-lg ">
      <div className="max-h-[calc(100vh-260px)] overflow-auto">
      <table className="w-full rounded-tr-lg overflow-hidden">
            <thead className="bg-[#252941] text-white">
              <tr>
                <th className="p-3 sm:p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === employees.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 accent-[#5663AC] cursor-pointer"
                  />
                </th>
                {["Name", "E-mail", "Department", "Account Number", "Salary"].map((header) => (
                  <th key={header} className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {header}
                      {header === "Salary" && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            sortConfig.key === "salary"
                              ? sortConfig.direction === "desc"
                                ? "rotate-180"
                                : ""
                              : ""
                          }`}
                          onClick={() => handleSort("salary")}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`${
                    index % 2 === 0 ? "bg-[#F1F6FC]" : "bg-[#DEE8FF]"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-3 sm:p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(employee.id)}
                      onChange={() => handleSelectRow(employee.id)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#5C69F8] cursor-pointer"
                    />
                  </td>
                  <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                    {truncateText(employee.name, 20)}
                  </td>
                  <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                    {employee.email}
                  </td>
                  <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                    {employee.department}
                  </td>
                  <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                    {employee.accountNumber}
                  </td>
                  <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                    {employee.salary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPayRoll;