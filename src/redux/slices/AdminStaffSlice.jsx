import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hotelcrew-1.onrender.com/api/edit/list/";
const EDIT_STAFF_URL = "https://hotelcrew-1.onrender.com/api/edit/update/";
const CACHE_KEY = 'staffData';
const DELETE_STAFF_URL = "https://hotelcrew-1.onrender.com/api/edit/delete/";
const STAFF_STATUS_URL = "https://hotelcrew-1.onrender.com/api/taskassignment/staff/available/";

const getAuthToken = () => {
  const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs'
  // const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

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

export const fetchStaffData = createAsyncThunk(
  "adminStaff/fetchStaffData",
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

export const editStaff = createAsyncThunk(
  "adminStaff/editStaff",
  async ({ employeeId, updatedData }, { rejectWithValue, dispatch, getState }) => {
    const previousState = getState().adminStaff.staffList;
    
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
  "adminStaff/deleteStaff",
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
  "adminStaff/fetchStaffStatus",
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
       ('Fetched staff status:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch staff status:', error);
      return rejectWithValue(error.response?.data || "Failed to fetch staff status");
    }
  }
);

export const createStaff = createAsyncThunk(
  'adminStaff/createStaff',
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



const AdminStaffSlice = createSlice({
  name: "staff",
  initialState: {
    ...initialState,
    availableStaff: 0,
    staffBusy: 0,
    totalStaff: 0
  },
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

export const { clearStaffCache, resetEditState } = AdminStaffSlice.actions;

export const selectStaffPerDepartment = (state) => state.adminStaff.staffPerDepartment;
export const selectStaffList = (state) => state.adminStaff.staffList;
export const selectStaffLoading = (state) => state.adminStaff.loading;
export const selectStaffError = (state) => state.adminStaff.error;
export const selectEditLoading = (state) => state.adminStaff.editLoading;
export const selectEditError = (state) => state.adminStaff.editError;

export const selectDepartments = () => {
  // Dummy department data
  return [
    { label: "Housekeeping", value: "housekeeping" },
    { label: "Kitchen", value: "kitchen" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Security", value: "security" }
  ];
};


export const selectTotalStaff = (state) => {
  // Get staff list from state
  if (!state?.staff?.staffList || !Array.isArray(state.staff.staffList)) {
    return []; 
  }
  
  const staffList = state.staff.staffList;
  
  if (Array.isArray(staffList)) {
    return staffList.length;
  }

  return 0;
};

export const selectStaffStatus = (state) => ({
  available: state.staff?.availableStaff || 0,
  busy: state.staff?.staffBusy || 0,
  total: state.staff?.totalStaff || 0,
  loading: state.staff?.loading || false
});

export const selectShifts = (state) => {
  const shifts = state.adminStaff.staffList
    .map(adminStaff => adminStaff.shift)
    .filter(Boolean)
    .filter((shift, index, self) => self.indexOf(shift) === index)
    .map(shift => ({
      label: shift.charAt(0).toUpperCase() + shift.slice(1),
      value: shift
    }));
  return shifts;
};

export default AdminStaffSlice.reducer;