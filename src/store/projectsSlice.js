import { createSlice } from "@reduxjs/toolkit";

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
			const index = state.projects.findIndex(
				(project) => project.id === updatedProject.id
			);
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
			const response = await fetch("http://localhost:5000/api/projects", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch projects");
			}

			const data = await response.json();
			dispatch(getProjectsSuccess(data));
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
			const response = await fetch("http://localhost:5000/api/projects", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(project),
			});

			if (!response.ok) {
				throw new Error("Failed to add project");
			}

			const newProject = await response.json();
			dispatch(addProjectSuccess(newProject));
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
			const response = await fetch(
				`http://localhost:5000/api/projects/${projectId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to delete project");
			}

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
		const response = await fetch(
			`http://localhost:5000/api/projects/${projectId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(project),
			}
		);

		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(`Failed to update project: ${errorMessage}`);
		}

		const updatedProject = await response.json();
		dispatch(updateProjectSuccess(updatedProject));
	} catch (error) {
		dispatch(getProjectsFailure(`Failed to update project: ${error.message}`)); // Выводим подробности ошибки
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
