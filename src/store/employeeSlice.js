import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	data: null,
	status: "idle", // idle | loading | succeeded | failed
	error: null,
};

// Асинхронный экшн для получения данных сотрудника
export const fetchEmployee = createAsyncThunk(
	"employee/fetchEmployee",
	async (_, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		if (!token) {
			return rejectWithValue("No token found. Please log in.");
		}

		try {
			const response = await axios.get("http://localhost:5000/api/employee", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response.data);
			return response.data;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || "Failed to fetch employee data"
			);
		}
	}
);

// Асинхронный экшн для обновления данных сотрудника
export const updateEmployee = createAsyncThunk(
	"employee/updateEmployee",
	async (employeeData, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		if (!token) {
			return rejectWithValue("No token found. Please log in.");
		}

		try {
			const response = await axios.put(
				"http://localhost:5000/api/employee",
				employeeData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return response.data; // Возвращаем данные от сервера
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || "Failed to update employee data"
			);
		}
	}
);
const employeeSlice = createSlice({
	name: "employee",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch employee
			.addCase(fetchEmployee.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchEmployee.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
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
				state.data = action.payload;
			})
			.addCase(updateEmployee.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export default employeeSlice.reducer;
