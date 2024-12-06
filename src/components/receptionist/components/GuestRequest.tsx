import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../redux/store';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { Dialog, Snackbar, Alert, AlertColor } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { createTask, selectTasksLoading, selectTasksError, selectTaskMetrics, fetchTasks } from '../../../redux/slices/TaskSlice';
import TaskAssignment from './TaskAssignment';
import LoadingAnimation from '../../common/LoadingAnimation';
import { selectDepartments, fetchStaffData } from '../../../redux/slices/StaffSlice'
import SmartTitleGenerator from '../../../feature/SmartTitleGenerator';
import PredictiveTextArea from '../../../feature/PredictiveTextArea';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const GuestRequest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector(selectDepartments);
  const taskMetrics = useSelector(selectTaskMetrics);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const Taskloading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selected, setSelected] = useState({ label: "Department", value: "" });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchStaffData());
  }, [dispatch]);

  useEffect(() => {
     ('Departments:', departments);
  }, [departments]);

  const handleSelect = (dept: { label: string, value: string }) => {
    setSelected(dept);
    setIsDropdownOpen(false);
  };

  const [deadline, setDeadline] = useState("");
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task title",
        severity: "error",
      });
      return;
    }

    if (!taskDescription.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task description",
        severity: "error",
      });
      return;
    }

    if (!selected.value) {
      setSnackbar({
        open: true,
        message: "Please select a department",
        severity: "error",
      });
      return;
    }

    try {
      const today = new Date();
      today.setHours(parseInt(selectedHour, 10));
      today.setMinutes(parseInt(selectedMinute, 10));
      today.setSeconds(0);

      const formattedDeadline = today.toISOString();
      await dispatch(
        createTask({
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          department: capitalizeFirstLetter(selected.value), 
          deadline: formattedDeadline,
        })
      ).unwrap();

      dispatch(fetchTasks());

      setTaskTitle("");
      setTaskDescription("");
      setSelected({ value: "", label: "Department" });
      setSelectedHour("09");
      setSelectedMinute("00");

      setSnackbar({
        open: true,
        message: "Task assigned successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to assign task",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const taskPercentage = Math.round((taskMetrics.completed / (taskMetrics.total || 1)) * 100);

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Guest Request
      </h1>

      <div className='flex xl:flex-row lg:flex-col flex-col'>
        <TaskAssignment />

        <div className='flex xl:flex-col lg:flex-col md:flex-row flex-col gap-4 xl:w-2/6 lg:w-full md:w-full h-full xl:mr-12 lg:p-4 xl:p-0 p-6 justify-between'>
          <div className='flex flex-col md:flex-row h-[90%] lg:flex-row xl:flex-col justify-between gap-4'>
            <form
              onSubmit={handleAssign}
              className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg md:flex-1 lg:flex-1 xl:w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg sm:text-xl font-semibold">Assign Task</h2>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none pr-16"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 ">
                <SmartTitleGenerator
                  description={taskDescription}
                  onTitleGenerated={setTaskTitle}
                  disabled={!taskDescription}
                />
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selected.value ? "text-black" : "text-gray-400"
                      } focus:outline-none flex justify-between items-center`}
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
                      {departments.map((dept) => (
                        <button
                          key={dept.value}
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
              <div className="relative w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <div className="flex space-x-2">
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-1/2 focus:outline-none"
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}:00
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-1/2 focus:outline-none"
                  >
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <PredictiveTextArea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task Description"
                maxLength={350}
                className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 xl:h-40 h-72 resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={Taskloading}
                  className="h-9 w-full bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white disabled:opacity-50 shadow-xl flex items-center justify-center"
                >
                  {Taskloading ? (
                    <LoadingAnimation size={24} color="#FFFFFF" />
                  ) : (
                    "Assign"
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-lg md:w-1/2 lg:w-1/2 xl:w-full">
              <h2 className="text-lg sm:text-xl font-semibold">Task Progress</h2>
              <div className="flex justify-center items-center">
                <div className="relative w-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl -mt-8 font-bold">{taskPercentage}%</span>
                  </div>
                  <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: taskMetrics.completed, color: '#34D399' },
                          { id: 1, value: taskMetrics.pending, color: '#facc15' }
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
                <div className="flex flex-col -mt-16 justify-center">
                  <div>
                    <h3 className="text-xl">Pending Tasks</h3>
                    <p className="text-3xl font-bold text-[#60A5FA]">{taskMetrics.pending}</p>
                  </div>
                  <div>
                    <h3 className="text-xl">Completed Tasks</h3>
                    <p className="text-3xl font-bold text-[#34D399]">{taskMetrics.completed}</p>
                  </div>
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