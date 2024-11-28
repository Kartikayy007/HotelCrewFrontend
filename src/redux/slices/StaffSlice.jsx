import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hotelcrew-1.onrender.com/api/edit/list/";
const EDIT_STAFF_URL = "https://hotelcrew-1.onrender.com/api/edit/update/";
const CACHE_KEY = 'staffData';
const DELETE_STAFF_URL = "https://hotelcrew-1.onrender.com/api/edit/delete/";

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
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
      console.log('Fetched staff data:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch staff data:');
      return rejectWithValue(error.response?.data || "Failed to fetch staff data");
    }
  }
);

export const editStaff = createAsyncThunk(
  "staff/editStaff",
  async ({ employeeId, updatedData }, { rejectWithValue, dispatch, getState }) => {
    const previousState = getState().staff.staffList;
    
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.put(
        `${EDIT_STAFF_URL}${employeeId}/`, 
        updatedData, 
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

const initialState = {
  staffPerDepartment: {},
  totalDepartments: 0,
  staffList: [],
  loading: false,
  error: null,
  editLoading: false,
  editError: null,
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
  return departments;
};

// In StaffSlice.jsx, add this selector:
export const selectTotalStaff = (state) => {
  const staffPerDept = state.staff.staffPerDepartment;
  if (!staffPerDept || typeof staffPerDept !== 'object') {
    return 0;
  }
  return Object.values(staffPerDept).reduce((sum, count) => sum + (Number(count) || 0), 0);
};

export default staffSlice.reducer;