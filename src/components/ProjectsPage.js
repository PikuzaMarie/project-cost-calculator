import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Button,
	Box,
	Typography,
	Pagination,
	Breadcrumbs,
	Link,
	Grid2,
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
import { useTheme } from "@emotion/react";

const ProjectsPage = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { projects, error } = useSelector((state) => state.projects);
	const [open, setOpen] = useState(false);
	const projectsPerPage = 4;

	const [searchQuery, setSearchQuery] = useState("");

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

	const filteredProjects = projects.filter((project) =>
		project.clientname.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSearch = (query) => {
		setSearchQuery(query); // Обновляем состояние поиска
	};

	const indexOfLastProject = page * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = filteredProjects.slice(
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
			<MainHeader onSearch={handleSearch} />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					padding: "24px 32px",
					gap: "40px",
				}}>
				<Breadcrumbs aria-label="breadcrumb">
					<Link
						underline="hover"
						color="inherit"
						href="/home">
						Main
					</Link>
					<Typography sx={{ color: theme.palette.black.main }}>
						Projects
					</Typography>
				</Breadcrumbs>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography
						variant="h6"
						component="p"
						gutterBottom
						sx={{
							color: theme.palette.custom.gray,
							fontWeight: 500,
						}}>
						Total Projects: {filteredProjects.length}
					</Typography>
					<Button
						variant="containedSecondary"
						size="normal"
						onClick={() => setOpen(true)}>
						New project
					</Button>
				</Box>

				{error && (
					<Typography
						variant="body1"
						sx={{
							color: theme.palette.error.contrastText,
							textAlign: "center",
							backgroundColor: theme.palette.error.light,
						}}>
						{error}
					</Typography>
				)}

				<Grid2
					container
					spacing={12}
					size={{ xs: 6, md: 8 }}
					sx={{
						backgroundColor: theme.palette.white.main,
						color: theme.palette.black.main,
					}}>
					{currentProjects.length > 0 ? (
						currentProjects.map((project) => (
							<Grid2
								xs={6}
								md={4}
								key={project.id}>
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
							</Grid2>
						))
					) : (
						<Grid2
							item
							xs={12}>
							<Typography
								variant="body2"
								sx={{ color: theme.palette.black.main, textAlign: "center" }}>
								No projects available.
							</Typography>
						</Grid2>
					)}
				</Grid2>

				<Box
					sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
					<Pagination
						count={Math.ceil(filteredProjects.length / projectsPerPage)}
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
