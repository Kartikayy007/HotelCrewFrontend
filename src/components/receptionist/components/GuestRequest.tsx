import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { Dialog, Snackbar, Alert, AlertColor } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { createTask, selectTasksLoading } from '../../../redux/slices/TaskSlice';
import TaskAssignment from './TaskAssignment';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const departments = [
  { label: "Security", value: "security" },
  { label: "Housekeeping", value: "housekeeping" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Front Desk", value: "frontdesk" },
  { label: "Maintenance", value: "maintenance" },
];

const GuestRequest: React.FC = () => {
  const dispatch = useDispatch();
  const Taskloading = useSelector(selectTasksLoading);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selected, setSelected] = useState({ label: "Department", value: "" });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  const taskStats = {
    ongoing: 8,
    completed: 12,
    total: 20
  };

  const completionPercentage = 60;

  const handleSelect = (dept: { label: string, value: string }) => {
    setSelected(dept);
    setIsDropdownOpen(false);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task title",
        severity: "error"
      });
      return;
    }

    if (!taskDescription.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task description",
        severity: "error"
      });
      return;
    }

    if (!selected.value) {
      setSnackbar({
        open: true,
        message: "Please select a department",
        severity: "error"
      });
      return;
    }

    try {
      // await dispatch(createTask({
      //   title: taskTitle.trim(),
      //   description: taskDescription.trim(),
      //   department: selected.value,
      //   priority: selectedPriority,
      // })).unwrap();

      setTaskTitle('');
      setTaskDescription('');
      setSelected({ label: "Select Department", value: "" });
      setSelectedPriority('');

      setSnackbar({
        open: true,
        message: "Task assigned successfully",
        severity: "success"
      });

    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to assign task",
        severity: "error"
      });
    } finally {
      setPriorityDropdownOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Guest Request
      </h1>

      <div className='flex xl:flex-row flex-col'>

        <TaskAssignment />

        <div className='flex xl:flex-col lg:flex-row flex-col gap-4 xl:w-2/6 h-full xl:mr-12 xl:p-0 p-6 '>

          <form onSubmit={handleAssign} className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-lg w-full ">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg sm:text-xl font-semibold">Assign Task</h2>
            </div>

            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
            />

            <div className="flex justify-between gap-4">
              {/* Priority Dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setPriorityDropdownOpen(!isPriorityDropdownOpen)}
                  className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selectedPriority ? "text-black" : "text-gray-400"
                    } focus:outline-none flex justify-between items-center`}
                >
                  {selectedPriority || "Select Priority"}
                  {isPriorityDropdownOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                </button>

                {isPriorityDropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                    {["High", "Medium", "Low"].map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => {
                          setSelectedPriority(priority);
                          setPriorityDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${priority === "High" ? "bg-red-500" :
                          priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                          }`}></span>
                        {priority}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selected.value ? "text-black" : "text-gray-400"
                    } focus:outline-none flex justify-between items-center`}
                >
                  {selected.label}
                  {isDropdownOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                </button>

                {isDropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                    {departments.map((dept, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelect(dept)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {dept.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task Description"
              maxLength={350}
              className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 h-44 resize-none focus:border-gray-300 focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={Taskloading}
                className="h-9 w-full bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white disabled:opacity-50"
              >
                {Taskloading ? "Assigning..." : "Assign"}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-lg w-full ">
            <h2 className="text-lg sm:text-xl font-semibold">
              Task Progress
            </h2>
            <div className="flex justify-center items-center gap-12">
              <div className="relative w-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl -mt-8 font-bold">{completionPercentage}%</span>
                </div>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: taskStats.ongoing, color: '#60A5FA' },
                        { id: 1, value: taskStats.completed, color: '#34D399' }
                      ],
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      innerRadius: 40,
                      outerRadius: 70,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  width={280}
                  height={192}
                  margin={{ bottom: 40 }}
                />
              </div>
              <div className="flex flex-col -mt-16">
                <div>
                  <h3 className="text-xl">On Going Tasks</h3>
                  <p className="text-3xl font-bold text-[#60A5FA]">{taskStats.ongoing}</p>
                </div>
                <div>
                  <h3 className="text-xl">Completed Tasks</h3>
                  <p className="text-3xl font-bold text-[#34D399]">{taskStats.completed}</p>
                </div>
              </div>
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
};

export default GuestRequest;