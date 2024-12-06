import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	employee: null,
	status: "idle",
	error: null,
};

const validateToken = (token, rejectWithValue) => {
	if (!token) {
		return rejectWithValue("No token found");
	}
};

export const fetchEmployee = createAsyncThunk(
	"employee/fetchEmployee",
	async (_, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.get("http://localhost:5000/api/employee", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response.data);
			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to fetch employee: ${error.message}`);
		}
	}
);

export const updateEmployee = createAsyncThunk(
	"employee/updateEmployee",
	async (employeeData, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.put(
				"http://localhost:5000/api/employee",
				employeeData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to update employee: ${error.message}`);
		}
	}
);

export const logoutEmployee = () => {
	localStorage.removeItem("token");
	return { type: "employee/logout" };
};

const employeeSlice = createSlice({
	name: "employee",
	initialState,
	reducers: {
		logout: (state) => {
			state.employee = null;
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch employee
			.addCase(fetchEmployee.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchEmployee.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.employee = action.payload;
			})
			.addCase(fetchEmployee.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Update employee
			.addCase(updateEmployee.pending, (state) => {
				state.status = "updating";
				state.error = null;
			})
			.addCase(updateEmployee.fulfilled, (state, action) => {
				state.status = "succeeded";
				console.log("Updated employee:", action.payload.employee);
				state.employee = action.payload.employee;
			})
			.addCase(updateEmployee.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { logout } = employeeSlice.actions;

export default employeeSlice.reducer;
