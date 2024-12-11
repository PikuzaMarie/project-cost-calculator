import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	projects: [],
	status: "idle",
	error: null,
};

const sortProjectsByName = (projects) => {
	return [...projects].sort((a, b) => {
		if (a.project_name.toLowerCase() < b.project_name.toLowerCase()) {
			return -1;
		} else if (a.project_name.toLowerCase() > b.project_name.toLowerCase()) {
			return 1;
		} else {
			return 0;
		}
	});
};

const validateToken = (token, rejectWithValue) => {
	if (!token) {
		return rejectWithValue("No token found");
	}
};

export const fetchProjects = createAsyncThunk(
	"projects/fetchProjects",
	async (token, { rejectWithValue }) => {
		try {
			const response = await axios.get("http://localhost:5000/api/projects", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to fetch project: ${error.message}`);
		}
	}
);

export const addProject = createAsyncThunk(
	"projects/addProject",
	async (project, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.post(
				"http://localhost:5000/api/projects",
				project,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to add project: ${error.message}`);
		}
	}
);

export const updateProject = createAsyncThunk(
	"projects/updateProject",
	async (project, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			const response = await axios.put(
				`http://localhost:5000/api/projects/${project.id}`,
				project,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(`Failed to update project: ${error.message}`);
		}
	}
);

export const deleteProject = createAsyncThunk(
	"projects/deleteProject",
	async (projectId, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		validateToken(token, rejectWithValue);
		try {
			await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return projectId;
		} catch (error) {
			return rejectWithValue(`Failed to delete project: ${error.message}`);
		}
	}
);

const projectsSlice = createSlice({
	name: "projects",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		setProjects: (state, action) => {
			state.projects = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch projects
			.addCase(fetchProjects.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.projects = sortProjectsByName(action.payload);
			})
			.addCase(fetchProjects.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Add project
			.addCase(addProject.fulfilled, (state, action) => {
				state.projects.unshift(action.payload);
				state.projects = sortProjectsByName(state.projects);
			})
			.addCase(addProject.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Delete project
			.addCase(deleteProject.fulfilled, (state, action) => {
				state.projects = state.projects.filter(
					(project) => project.id !== action.payload
				);
			})
			.addCase(deleteProject.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// Update project
			.addCase(updateProject.fulfilled, (state, action) => {
				const updatedProject = action.payload;
				const index = state.projects.findIndex(
					(project) => project.id === updatedProject.id
				);
				if (index !== -1) {
					state.projects[index] = updatedProject;
				}
			})
			.addCase(updateProject.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { clearError, setProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
