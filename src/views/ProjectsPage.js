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
	Alert,
	IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CreateProjectForm from "../components/CreateProjectForm";
import ProjectDetails from "../components/ProjectDetails";
import MainHeader from "../components/MainHeader";
import {
	fetchProjects,
	addProject,
	deleteProject,
	clearError,
} from "../store/slices/projectsSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@emotion/react";
import DeleteDialog from "../components/DeleteDialog";
import { jwtDecode } from "jwt-decode";

const ProjectsPage = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { projects, error } = useSelector((state) => state.projects);
	const [open, setOpen] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState(null);
	const projectsPerPage = 4;

	const [searchQuery, setSearchQuery] = useState("");

	const [page, setPage] = useState(1);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/");
		} else {
			const decodedToken = jwtDecode(token);
			const currentTime = Date.now() / 1000;

			if (decodedToken.exp < currentTime) {
				localStorage.removeItem("token");
				navigate("/");
			} else {
				dispatch(clearError());
				dispatch(fetchProjects(token));
			}
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
		project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
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
		navigate(`/home/projects/${id}?page=${page}`);
	};

	const handleOpenDeleteDialog = (projectId) => {
		setProjectToDelete(projectId);
		setOpenDeleteDialog(true);
	};

	const handleDeleteProject = () => {
		if (projectToDelete) {
			dispatch(deleteProject(projectToDelete));
		}
		setOpenDeleteDialog(false);
		setProjectToDelete(null); // Сбрасываем ID
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
					<Alert
						variant="outlined"
						severity="error"
						sx={{
							display: "flex",
							gap: "4px",
							alignItems: "center",
							color: theme.palette.error.main,
						}}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: "67vw",
							}}>
							<Typography color="error"> {error}</Typography>
							<IconButton onClick={() => dispatch(clearError())}>
								<ClearIcon color="error" />
							</IconButton>
						</Box>
					</Alert>
				)}

				<Grid2
					container
					spacing={12}
					size={{ xs: 6, md: 8 }}
					sx={{
						backgroundColor: theme.palette.white.main,
						color: theme.palette.black.main,
						minHeight: "428px",
					}}>
					{currentProjects.length > 0 ? (
						currentProjects.map((project) => (
							<Grid2
								xs={6}
								md={4}
								key={project.id}>
								<ProjectDetails
									projectId={project.id}
									projectName={project.project_name}
									clientName={project.client_name}
									cost={project.cost}
									projectDescription={project.project_description}
									projectStatus={project.project_status}
									createdDate={project.created_date}
									reportId={project.report_id}
									onEditProject={() => handleEditProject(project.id)}
									onDeleteProject={() => handleOpenDeleteDialog(project.id)}
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

				<DeleteDialog
					open={openDeleteDialog}
					onClose={() => setOpenDeleteDialog(false)}
					onSubmit={handleDeleteProject}
				/>
			</Box>
		</Box>
	);
};

export default ProjectsPage;
