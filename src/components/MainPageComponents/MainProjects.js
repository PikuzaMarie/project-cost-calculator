import React, { useState } from "react";
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
import CreateProjectForm from "./CreateProjectForm";
import ProjectDetails from "./ProjectDetails";

const MainProjects = () => {
	const [projects, setProjects] = useState([]);
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(1);
	const projectsPerPage = 5;

	const handleChangePage = (value) => {
		setPage(value);
	};

	const indexOfLastProject = page * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = projects.slice(
		indexOfFirstProject,
		indexOfLastProject
	);

	const addNewProject = (project) => {
		setProjects([...projects, project]);
		setOpen(false);
	};

	return (
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
					href="/">
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
						{currentProjects.map((project, index) => (
							<ListItem key={index}>
								<ProjectDetails
									projectName={project.projectName}
									clientName={project.clientName}
									projectDescription={project.projectDescription}
									projectStatus={project.projectStatus}
									createdDate={project.createdDate}
									closedDate={project.closedDate}
									reports={project.reports}
									onCreateReport={() =>
										console.log("Create Report for", project.projectName)
									} // Логика создания отчета
									onEditProject={() =>
										console.log("Edit Project", project.projectName)
									} // Логика редактирования
									onDeleteProject={() => {
										setProjects(projects.filter((_, i) => i !== index));
									}} // Логика удаления проекта
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
	);
};

export default MainProjects;
