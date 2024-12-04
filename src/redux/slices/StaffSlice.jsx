import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hotelcrew-1.onrender.com/api/edit/list/";
const EDIT_STAFF_URL = "https://hotelcrew-1.onrender.com/api/edit/update/";
const CACHE_KEY = 'staffData';
const DELETE_STAFF_URL = "https://hotelcrew-1.onrender.com/api/edit/delete/";
const STAFF_STATUS_URL = "https://hotelcrew-1.onrender.com/api/taskassignment/staff/available/";

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Add utility function at the top
const capitalizeFirstLetter = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : '';
};

// Add this with other utility functions at the top of the file
const capitalizeShift = (shift) => {
  return shift ? shift.charAt(0).toUpperCase() + shift.slice(1).toLowerCase() : '';
};

export const fetchStaffData = createAsyncThunk(
  "staff/fetchStaffData",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.get(API_URL, config);
       ('Fetched staff data:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch staff data:');
      return rejectWithValue(error.response?.data || "Failed to fetch staff data");
    }
  }
);

// Update editStaff thunk
export const editStaff = createAsyncThunk(
  "staff/editStaff",
  async ({ employeeId, updatedData }, { rejectWithValue, dispatch, getState }) => {
    const previousState = getState().staff.staffList;
    
    try {
      const token = getAuthToken();
      
      // Capitalize fields before sending
      const capitalizedData = {
        ...updatedData,
        role: capitalizeFirstLetter(updatedData.role),
        shift: capitalizeFirstLetter(updatedData.shift),
        department: capitalizeFirstLetter(updatedData.department),
        user_name: capitalizeFirstLetter(updatedData.user_name)
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.patch(
        `${EDIT_STAFF_URL}${employeeId}/`, 
        capitalizedData, 
        config
      );

      return { employeeId, updatedData: response.data };
    } catch (error) {
      dispatch(setStaffList(previousState));
      return rejectWithValue(error.response?.data || "Failed to edit staff");
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (employeeId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      await axios.delete(`${DELETE_STAFF_URL}${employeeId}/`, config);
      return employeeId;
    } catch (error) {
      console.error('Failed to delete staff:', error);
      return rejectWithValue(error.response?.data || "Failed to delete staff");
    }
  }
);

export const fetchStaffStatus = createAsyncThunk(
  "staff/fetchStaffStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.get(STAFF_STATUS_URL, config);
      console.log('Staff status response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Failed to fetch staff status:', error);
      return rejectWithValue(error.response?.data || "Failed to fetch staff status");
    }
  }
);

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (staffData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/edit/create/',
        staffData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create staff');
    }
  }
);

const initialState = {
  staffPerDepartment: {},
  totalDepartments: 0,
  staffList: [],
  loading: false,
  error: null,
  editLoading: false,
  editError: null,
  availableStaff: 0,
  staffBusy: 0,
  totalStaff: 0,
  staffStatusLoading: false,
  staffStatusError: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearStaffCache: (state) => {
      localStorage.removeItem(CACHE_KEY);
      state.staffPerDepartment = {};
      state.totalDepartments = 0;
      state.staffList = [];
    },
    resetEditState: (state) => {
      state.editLoading = false;
      state.editError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffData.fulfilled, (state, action) => {
        state.loading = false;
        state.staffPerDepartment = action.payload.staff_per_department;
        state.totalDepartments = action.payload.total_departments;
        state.staffList = action.payload.staff_list;
      })
      .addCase(fetchStaffData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editStaff.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editStaff.fulfilled, (state, action) => {
        state.editLoading = false;
      })
      .addCase(editStaff.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      })
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStaffStatus.pending, (state) => {
        state.staffStatusLoading = true;
        state.staffStatusError = null;
      })
      .addCase(fetchStaffStatus.fulfilled, (state, action) => {
        state.staffStatusLoading = false;
        state.availableStaff = action.payload.availablestaff;
        state.staffBusy = action.payload.staffbusy;
        state.totalStaff = action.payload.totalstaff;
      })
      .addCase(fetchStaffStatus.rejected, (state, action) => {
        state.staffStatusLoading = false;
        state.staffStatusError = action.payload;
      });
  },
});

export const { clearStaffCache, resetEditState } = staffSlice.actions;

export const selectStaffPerDepartment = (state) => state.staff.staffPerDepartment;
export const selectStaffList = (state) => state.staff.staffList;
export const selectStaffLoading = (state) => state.staff.loading;
export const selectStaffError = (state) => state.staff.error;
export const selectEditLoading = (state) => state.staff.editLoading;
export const selectEditError = (state) => state.staff.editError;

export const selectDepartments = (state) => {
  const departments = state.staff.staffList
    .map(staff => staff.department)
    .filter(Boolean)
    .filter((dept, index, self) => self.indexOf(dept) === index)
    .map(dept => ({
      label: dept.charAt(0).toUpperCase() + dept.slice(1),
      value: dept
    }));
     ('Departments:', departments);
  return departments;
};


export const selectTotalStaff = (state) => {
  const staffList = state.staff.staffList;
  
  if (Array.isArray(staffList)) {
    return staffList.length;
  }
  
  return 0;
};

export const selectStaffStatus = (state) => ({
  available: state.staff.availableStaff,
  busy: state.staff.staffBusy,
  total: state.staff.totalStaff,
  loading: state.staff.staffStatusLoading,
  error: state.staff.staffStatusError
});

// Update selectShifts selector to use the function
export const selectShifts = (state) => {
  const shifts = state.staff.staffList
    .map(staff => staff.shift)
    .filter(Boolean)
    .filter((shift, index, self) => self.indexOf(shift) === index)
    .map(shift => ({
      label: capitalizeShift(shift),
      value: shift.toLowerCase()
    }));
  return shifts;
};

export default staffSlice.reducer;