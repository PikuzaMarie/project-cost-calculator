import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	projects: [],
	status: "idle",
	error: null,
};

const sortProjectsByName = (projects) => {
	return [...projects].sort((a, b) => {
		if (a.projectname.toLowerCase() < b.projectname.toLowerCase()) {
			return -1;
		} else if (a.projectname.toLowerCase() > b.projectname.toLowerCase()) {
			return 1;
		} else {
			return 0;
		}
	});
};

const findProjectIndex = (projects, projectId) => {
	return projects.findIndex((project) => project.id === projectId);
};

const projectsSlice = createSlice({
	name: "projects",
	initialState,
	reducers: {
		getProjectsStart: (state) => {
			state.status = "loading";
		},
		getProjectsSuccess: (state, action) => {
			state.status = "succeeded";
			state.projects = sortProjectsByName(action.payload);
		},
		getProjectsFailure: (state, action) => {
			state.status = "failed";
			state.error = action.payload;
		},
		addProjectSuccess: (state, action) => {
			state.projects.unshift(action.payload);
			state.projects = sortProjectsByName(state.projects);
		},
		deleteProjectSuccess: (state, action) => {
			state.projects = state.projects.filter(
				(project) => project.id !== action.payload
			);
		},
		updateProjectSuccess: (state, action) => {
			const updatedProject = action.payload;
			const index = findProjectIndex(state.projects, updatedProject.id);
			if (index !== -1) {
				state.projects[index] = updatedProject;
			}
		},
		clearError: (state) => {
			state.error = null;
		},
		setProjects: (state, action) => {
			state.projects = action.payload;
		},
	},
});

export const fetchProjects = (token) => {
	return async (dispatch) => {
		dispatch(clearError());
		dispatch(getProjectsStart());
		try {
			const response = await axios.get("http://localhost:5000/api/projects", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			dispatch(getProjectsSuccess(response.data));
		} catch (error) {
			dispatch(getProjectsFailure(error.message));
		}
	};
};

export const addProject = (project) => {
	return async (dispatch) => {
		dispatch(clearError());

		const token = localStorage.getItem("token");

		if (!token) {
			dispatch(getProjectsFailure("No token found"));
			return;
		}

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

			dispatch(addProjectSuccess(response.data));
		} catch (error) {
			dispatch(getProjectsFailure("Failed to add project. Please try again."));
		}
	};
};

export const deleteProject = (projectId) => {
	return async (dispatch) => {
		dispatch(clearError());
		const token = localStorage.getItem("token");

		if (!token) {
			dispatch(getProjectsFailure("No token found"));
			return;
		}

		try {
			await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			dispatch(deleteProjectSuccess(projectId));
		} catch (error) {
			dispatch(
				getProjectsFailure("Failed to delete project. Please try again.")
			);
		}
	};
};

export const updateProject = (project, projectId) => async (dispatch) => {
	dispatch(clearError());
	const token = localStorage.getItem("token");

	if (!token) {
		dispatch(getProjectsFailure("No token found"));
		return;
	}

	if (!project.id) {
		dispatch(getProjectsFailure("Project ID is missing"));
		return;
	}

	try {
		const response = await axios.put(
			`http://localhost:5000/api/projects/${projectId}`,
			project,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		dispatch(updateProjectSuccess(response.data));
	} catch (error) {
		dispatch(getProjectsFailure(`Failed to update project: ${error.message}`));
	}
};

export const {
	getProjectsStart,
	getProjectsSuccess,
	getProjectsFailure,
	addProjectSuccess,
	deleteProjectSuccess,
	updateProjectSuccess,
	clearError,
	setProjects,
	addReport,
	updateReport,
} = projectsSlice.actions;

export default projectsSlice.reducer;
