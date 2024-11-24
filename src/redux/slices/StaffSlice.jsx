import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://13.200.191.108:8000/api/edit/list/";

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTk5ODM1LCJpYXQiOjE3MzIwMDc4MzUsImp0aSI6ImYxYzFkODE1NTU3NTQzYjhiNWRlMzYzOTNmOTAxYThmIiwidXNlcl9pZCI6NjR9.dxiN8N9Cf7EWpg33MgjluaCfemeRxMytdD613bDhzWc';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

export const fetchStaffData = createAsyncThunk(
  "staff/fetchStaffData",
  async (_, {rejectWithValue}) => {
    try {

      const token = getAuthToken();

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(API_URL, config);

      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch staff data");
    }
  }
);

const initialState = {
  staffPerDepartment: {},
  totalDepartments: 0,
  staffList: [],
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
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
      });
  },
});

export const selectStaffPerDepartment = (state) => state.staff.staffPerDepartment;
export const selectStaffList = (state) => state.staff.staffList;
export const selectStaffLoading = (state) => state.staff.loading;
export const selectStaffError = (state) => state.staff.error;

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

export default staffSlice.reducer;