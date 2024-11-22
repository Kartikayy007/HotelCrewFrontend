import React, {useState, useEffect} from "react";
import {Search, ChevronDown} from "lucide-react";

const MAX_NAME_LENGTH = 20;

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

function AdminPayRoll() {
  const [employees, setEmployees] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({key: null, direction: "asc"});
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12 text-[#252941]">
        Payroll
      </h1>

      <div className="filters flex justify-start md:justify-center mb-5">
        <div className="filter-buttons flex flex-col lg:flex-row gap-2 items-center w-full max-w-7xl">
          <h1 className="text-2xl font-medium space-nowrap text-start lg:block hidden">
            Filters
          </h1>

          <div className="flex-1 w-full mx-8 relative">
            <div className="scroll-container flex gap-2 overflow-x-auto hide-scrollbar w-full">
              <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full">
                <option value="All">Department</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
              </select>

              <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full">
                <option value="All">All Shift</option>
                <option value="day shift">Day Shift</option>
                <option value="night shift">Night Shift</option>
              </select>

              {/* <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full">
                <option value="All">Salary Range</option>
                <option value="entry">
                  Entry Level (Min - 25th percentile)
                </option>
                <option value="mid">Mid Level (25th - 75th percentile)</option>
                <option value="senior">
                  Senior Level (75th - 90th percentile)
                </option>
                <option value="executive">
                  Executive Level (90th+ percentile)
                </option>
              </select> */}

              {/* <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full">
                <option value="All">Performance</option>
                <option value="Paid">above 50</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select> */}
            </div>
          </div>

          <div className="relative w-full md:w-full lg:w-2/6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F1F6FC] hover:bg-gray-300 w-full text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-scroll h-[80vh] ">
          <table className="w-full">
            <thead className="bg-[#252941] sticky top-0 text-white ">
              <tr>
                <th className="rounded-tl-lg p-4 text-left font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === employees.length}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 accent-[#5663AC] cursor-pointer"
                  />
                </th>
                {["Name", "E-mail", "Department", "Account Number"].map(
                  (header) => (
                    <th
                      key={header}
                      className="p-4 text-left font-semibold"
                    >
                      <div className="flex items-center gap-1">
                        {header}
                      </div>
                    </th>
                  )
                )}
                <th
                  className="rounded-tr-lg p-4 text-left font-semibold cursor-pointer"
                  onClick={() => handleSort("salary")}
                >
                  <div className="flex items-center gap-1">
                    Salary
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        sortConfig.key === "salary"
                          ? sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                          : ""
                      }`}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-[#F1F6FC]" : "bg-[#DEE8FF]"
                  } hover:bg-gray-50`}
                >
                  <td className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(employee.id)}
                      onChange={() => handleSelectRow(employee.id)}
                      className="w-5 h-5 rounded border-gray-300 accent-[#5C69F8] cursor-pointer"
                    />
                  </td>
                  <td className="p-4">{truncateText(employee.name, MAX_NAME_LENGTH)}</td>
                  <td className="p-4">{employee.email}</td>
                  <td className="p-4">{employee.department}</td>
                  <td className="p-4">{employee.accountNumber}</td>
                  <td className="p-4">{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminPayRoll;
