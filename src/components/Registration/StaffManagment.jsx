import React, { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import staffIcon from '/staff.svg';
import plus from '/tabler_plus.svg';
import lineIcon from '/Line.svg';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function StaffManagement({ onNext, onBack, updateFormData, initialData }) {
  const [departments, setDepartments] = useState(['', '', '']);
  const [error, setError] = useState('');
  const departmentRefs = useRef([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (initialData.department_names && initialData.department_names.length > 0) {
      setDepartments(initialData.department_names);
    }
  }, [initialData]);

  const handleAddDepartment = () => {
    setDepartments([...departments, '']);
    setError('');
  };

  const handleDepartmentChange = (index, value) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
  };

  // const handleDeleteDepartment = (index) => {
  //   const newDepartments = departments.filter((_, i) => i !== index);
  //   setDepartments(newDepartments);
  // };
  const handleDeleteDepartment = (index) => {
    if (departments.length > 1) { // Check to ensure there is more than one department
      const newDepartments = departments.filter((_, i) => i !== index);
      setDepartments(newDepartments);
    } else {
      setSnackbar({
        open: true,
        message: "You must have atleast one department.",
        severity: "error",
      });
    }
  };
  
  const handleNextClick = (e) => {
    e.preventDefault();
    if (departments.some(department => department === '')) {
      setSnackbar({
        open: true,
        message: "Please fill out all required fields.",
        severity: "error",
      });
      const emptyDepartmentIndex = departments.findIndex(department => !department);
      if (emptyDepartmentIndex !== -1 && departmentRefs.current[emptyDepartmentIndex]) {
        departmentRefs.current[emptyDepartmentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const departmentData = {
      department_names: departments,
      number_of_departments: departments.length
    };
    updateFormData(departmentData); 
    onNext();
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <section className="min-h-screen bg-white flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-12 xl:ml-[5.1rem] m-auto p-4 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden font-medium bg-white gap-3 mb-4 relative top-0 ">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 3 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 my-4">
          <img
            src={staffIcon}
            alt="staff"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-3xl font-medium font-Montserrat">
            Staff Management
          </h2>
          <p className="font-sans text-lg font-normal text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>

        <form className="space-y-2 w-full xl:w-40-">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden xl:block xl:text-left">Staff Management</h1>
          </div>

          <div className="flex justify-between items-end gap-3">
            <label htmlFor="hotel-name" className="block text-lg font-sans font-semibold text-neutral-950">
              Departments
            </label>
            <button type="button" onClick={handleAddDepartment} className='xl:fixed xl:left-[42.8%]'>
              <img src={plus} alt="Add department" />
            </button>
          </div>

          <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
            {departments.map((department, index) => (
              <div 
              key={index} 
              ref={(el) => (departmentRefs.current[index] = el)}
              className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  className={`placeholder:text-base h-8 w-[285px] xl:w-[623px] py-2 px-4 text-xl  border rounded-[4px] focus:outline-none ${
                    !department && error ? 'border-[#99182C]' : 'border-[#BDBDBD]'
                  } focus:border-purple-500`}
                  placeholder={'Department ' + (index + 1)}
                  value={department}
                  onChange={(e) => handleDepartmentChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteDepartment(index)}
                  className="p-2 text-gray-500 hover:text-[#99182C] transition-colors"
                  aria-label="Delete department"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
            <div className='h-5 '>
          {error && <p className="text-[#99182C] xl:fixed">{error}</p>}
          </div>
          <div className="xl:fixed xl:top-[80vh]">
            <div className="xl:flex xl:justify-between flex justify-between">
              <button
                type="button"
                onClick={() => { updateFormData({ department_names: departments }); onBack(); }}
                className="h-9 w-28 bg-gray-400 font-Montserrat font-bold rounded-lg text-white"
              >
                <span>Back </span>
              </button>
              <button
                onClick={handleNextClick}
                className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white xl:fixed xl:left-[41.2vw]"
              >
                <span>Next </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </form>

        <div>
          <div className="hidden xl:block xl:w-[512px] font-medium xl:h-[100vh] bg-white shadow-2xl border-none rounded-lg fixed top-0 right-0">
            <div className="flex gap-7 text-[32px]">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 3
                      ? "border-[#5C69F8] text-black"
                      : "text-black bg-white border-none"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <img className="relative hidden xl:block top-36 left-[43.7%]" src={lineIcon} alt="" />
            <img className="relative hidden xl:block top-[80%] left-[43.7%]" src={lineIcon} alt="" />
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src={staffIcon}
                alt="Hotel Icon"
                className="h-24 mb-4 text-[#5663AC]"
              />
              <h2 className="text-2xl font-[500] font-Montserrat">Staff Management</h2>
              <p className="font-sans font-normal text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-normal text-center">You can always edit the data in the</span>
                <br />
                <span className="font-sans font-normal text-center">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
        </Snackbar>
    </section>
  );
}

export default StaffManagement;