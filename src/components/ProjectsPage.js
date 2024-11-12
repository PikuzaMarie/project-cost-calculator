import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import CreateProjectForm from "./CreateProjectForm";
import ProjectDetails from "./ProjectDetails";
import MainHeader from "./MainHeader";

const ProjectsPage = () => {
	const navigate = useNavigate();
	const [projects, setProjects] = useState([]);
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(1);
	const projectsPerPage = 5;

	useEffect(() => {
		const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
		setProjects(storedProjects);
	}, []);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const indexOfLastProject = page * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = projects.slice(
		indexOfFirstProject,
		indexOfLastProject
	);

	const addNewProject = (project) => {
		const newProject = { ...project, id: Date.now() };
		const updatedProjects = [newProject, ...projects];
		setProjects(updatedProjects);
		localStorage.setItem("projects", JSON.stringify(updatedProjects));
		setOpen(false);
	};

	const handleEditProject = (id) => {
		navigate(`/home/projects/${id}`);
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

				<Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
					{currentProjects.length > 0 ? (
						<List>
							{currentProjects.map((project) => (
								<ListItem key={project.id}>
									<ProjectDetails
										projectId={project.id}
										projectName={project.projectName}
										clientName={project.clientName}
										projectDescription={project.projectDescription}
										projectStatus={project.projectStatus}
										createdDate={project.createdDate}
										closedDate={project.closedDate}
										reports={project.reports}
										onEditProject={() => handleEditProject(project.id)}
										onDeleteProject={() => {
											const updatedProjects = projects.filter(
												(p) => p.id !== project.id
											);
											setProjects(updatedProjects);
											localStorage.setItem(
												"projects",
												JSON.stringify(updatedProjects)
											);
										}}
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
