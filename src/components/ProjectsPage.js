import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Button,
	Box,
	Typography,
	List,
	ListItem,
	Pagination,
	Breadcrumbs,
	Link,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CreateProjectForm from "./CreateProjectForm";
import ProjectDetails from "./ProjectDetails";
import MainHeader from "./MainHeader";
import {
	fetchProjects,
	addProject,
	deleteProject,
} from "../store/projectsSlice";

const ProjectsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { projects, error } = useSelector((state) => state.projects);
	const [open, setOpen] = useState(false);
	const projectsPerPage = 2;

	const qParams = new URLSearchParams(location.search);
	const pageFromURL = parseInt(qParams.get("page") || 1);
	const [page, setPage] = useState(pageFromURL);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/login");
		} else {
			dispatch(fetchProjects(token));
		}
	}, [dispatch, navigate]);

	useEffect(() => {
		navigate({
			pathname: location.pathname,
			search: `?page=${page}`,
		});
	}, [page, navigate, location.pathname]);

	const handleChangePage = (state, value) => {
		setPage(value);
	};

	const indexOfLastProject = page * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = projects.slice(
		indexOfFirstProject,
		indexOfLastProject
	);

	const handleEditProject = (id) => {
		navigate(`/home/projects/${id}`);
	};

	const handleDeleteProject = (projectId) => {
		dispatch(deleteProject(projectId));
	};

	const addNewProject = (project) => {
		const newProject = {
			...project,
			projectstatus: "active",
		};
		dispatch(addProject(newProject));
		setOpen(false);
	};

	return (
		<Box>
			<MainHeader />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					padding: "16px 32px",
					gap: "40px",
				}}>
				<Breadcrumbs aria-label="breadcrumb">
					<Link
						underline="hover"
						color="inherit"
						href="/home">
						Main
					</Link>
					<Typography sx={{ color: "text.primary" }}>Projects</Typography>
				</Breadcrumbs>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography
						variant="h6"
						gutterBottom>
						Total Projects: {projects.length}
					</Typography>
					<Button
						variant="contained"
						color="primary"
						size="normal"
						onClick={() => setOpen(true)}>
						New project
					</Button>
				</Box>

				{error && (
					<Typography
						variant="body2"
						sx={{ color: "error.main", textAlign: "center" }}>
						{error.message}
					</Typography>
				)}

				<Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
					{currentProjects.length > 0 ? (
						<List>
							{currentProjects.map((project) => (
								<ListItem key={project.id}>
									<ProjectDetails
										projectId={project.id}
										projectName={project.projectname}
										clientName={project.clientname}
										cost={project.cost}
										projectDescription={project.projectdescription}
										projectStatus={project.projectstatus}
										createdDate={project.createddate}
										onEditProject={() => handleEditProject(project.id)}
										onDeleteProject={() => handleDeleteProject(project.id)}
									/>
								</ListItem>
							))}
						</List>
					) : (
						<Typography
							variant="body2"
							sx={{ color: "#555", textAlign: "center" }}>
							No projects available.
						</Typography>
					)}
				</Box>

				<Box
					sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
					<Pagination
						count={Math.ceil(projects.length / projectsPerPage)}
						page={page}
						onChange={handleChangePage}
						color="primary"
					/>
				</Box>

				<CreateProjectForm
					open={open}
					onClose={() => setOpen(false)}
					onSubmit={addNewProject}
				/>
			</Box>
		</Box>
	);
};

export default ProjectsPage;
