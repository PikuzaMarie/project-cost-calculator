import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	reports: [],
	status: "idle",
	error: null,
};

const validateToken = (token, rejectWithValue) => {
	if (!token) {
		return rejectWithValue("No token found");
	}
};

export const fetchAllReports = createAsyncThunk(
	"reports/fetchAllReports",
	async (_, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.get("http://localhost:5000/api/reports", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to fetch all reports: ${error.message}`);
		}
	}
);

export const fetchReportByProjectId = createAsyncThunk(
	"reports/fetchReportByProjectId",
	async (projectId, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.get(
				`http://localhost:5000/api/projects/${projectId}/report`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to fetch report by id: ${error.message}`);
		}
	}
);

export const createOrUpdateReport = createAsyncThunk(
	"reports/createOrUpdateReport",
	async ({ projectId, report }, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.post(
				`http://localhost:5000/api/projects/${projectId}/report`,
				report,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return { projectId, report: response.data };
		} catch (error) {
			return rejectWithValue(
				`Failed to create or upadate report: ${error.message}`
			);
		}
	}
);

export const deleteReport = createAsyncThunk(
	"reports/deleteReport",
	async (projectId, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			await axios.delete(
				`http://localhost:5000/api/projects/${projectId}/report`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return projectId;
		} catch (error) {
			return rejectWithValue(`Failed to delete report: ${error.message}`);
		}
	}
);

const reportsSlice = createSlice({
	name: "reports",
	initialState,
	reducers: {
		setReports: (state, action) => {
			state.reports = action.payload;
		},
		addReport: (state, action) => {
			state.reports.push(action.payload);
		},
		removeReport: (state, action) => {
			state.reports = state.reports.filter(
				(report) => report.id !== action.payload
			);
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch all reports
			.addCase(fetchAllReports.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchAllReports.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.reports = action.payload;
			})
			.addCase(fetchAllReports.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Fetch report
			.addCase(fetchReportByProjectId.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchReportByProjectId.fulfilled, (state, action) => {
				state.status = "succeeded";
				const index = state.reports.findIndex(
					(report) => report.projectId === action.payload.projectId
				);
				if (index !== -1) {
					state.reports[index] = action.payload;
				} else {
					state.reports.push(action.payload);
				}
			})
			.addCase(fetchReportByProjectId.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Create or update reports
			.addCase(createOrUpdateReport.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createOrUpdateReport.fulfilled, (state, action) => {
				state.status = "succeeded";
				const index = state.reports.findIndex(
					(report) => report.id === action.payload.report.id
				);
				if (index !== -1) {
					state.reports[index] = action.payload.report;
				} else {
					state.reports.push(action.payload.report);
				}
			})
			.addCase(createOrUpdateReport.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Delete report
			.addCase(deleteReport.pending, (state) => {
				state.status = "loading";
			})
			.addCase(deleteReport.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.reports = state.reports.filter(
					(report) => report.projectId !== action.payload
				);
			})
			.addCase(deleteReport.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { setReports, addReport, removeReport, setError } =
	reportsSlice.actions;
export default reportsSlice.reducer;
