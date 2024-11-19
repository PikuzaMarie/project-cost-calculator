import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	reports: [],
	status: "idle",
	error: null,
};

// Получение всех отчетов
export const fetchAllReports = createAsyncThunk(
	"reports/fetchAllReports",
	async (_, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		try {
			const response = await axios.get("http://localhost:5000/api/reports", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);
//Получение отчёта по id
export const fetchReportByProjectId = createAsyncThunk(
	"reports/fetchReportByProjectId",
	async (projectId, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
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
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);
// Создание или обновление отчета
export const createOrUpdateReport = createAsyncThunk(
	"reports/createOrUpdateReport",
	async ({ projectId, report }, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
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
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);
// Удаление отчета why projectId
export const deleteReport = createAsyncThunk(
	"reports/deleteReport",
	async (projectId, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
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
			return rejectWithValue(error.response?.data || error.message);
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
			.addCase(fetchReportByProjectId.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchReportByProjectId.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Обновляем отчет для конкретного проекта (например, если он уже существует)
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
			.addCase(createOrUpdateReport.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createOrUpdateReport.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Обновляем или добавляем отчет
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
			.addCase(deleteReport.pending, (state) => {
				state.status = "loading";
			})
			.addCase(deleteReport.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Удаляем отчет по ID проекта
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
