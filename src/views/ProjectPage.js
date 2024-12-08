import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Breadcrumbs,
	Link,
	Select,
	MenuItem,
	IconButton,
	Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import MainHeader from "../components/MainHeader";
import DeleteDialog from "../components/DeleteDialog";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
	fetchProjects,
	deleteProject,
	updateProject,
} from "../store/slices/projectsSlice";
import { fetchAllReports } from "../store/slices/reportsSlice";
import { jwtDecode } from "jwt-decode";

const EditProject = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { projectId } = useParams();
	const dispatch = useDispatch();
	const projects = useSelector((state) => state.projects.projects);
	const [project, setProject] = useState(null);
	const reports = useSelector((state) => state.reports.reports);
	const [currentReport, setCurrentReport] = useState(null);
	const [closedDate, setClosedDate] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	const [error, setError] = useState(false);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
			}
		}
	}, [navigate]);

	useEffect(() => {
		if (!projectId) {
			console.error("projectId is missing");
			navigate("/home/projects");
			return;
		}

		if (projects.length === 0) {
			dispatch(fetchProjects());
		} else {
			const projectToEdit = projects.find(
				(p) => p.id === parseInt(projectId, 10)
			);
			if (projectToEdit) {
				const today = new Date().toISOString().split("T")[0];
				setClosedDate(today);
				setProject(projectToEdit);
				console.log(projectToEdit);
			} else {
				navigate("/home/projects");
			}
		}

		dispatch(fetchAllReports());
	}, [projects, projectId, dispatch, navigate]);

	// После загрузки проекта и отчетов ищем актуальный отчет
	useEffect(() => {
		if (reports.length > 0 && project) {
			const report = reports.find(
				(report) => report.projectid === parseInt(projectId, 10)
			);
			setCurrentReport(report || null);
		}
	}, [reports, project, projectId]);

	// Функция для форматирования даты
	const formatDate = (date) => {
		if (!date) return "";
		const formattedDate = new Date(date);
		return formattedDate instanceof Date && !isNaN(formattedDate)
			? formattedDate.toISOString().split("T")[0]
			: "";
	};

	// Функция сохранения изменений
	const handleSave = () => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		} else {
			if (!project.projectname || !project.clientname) {
				setError(true);
				return;
			} else {
				const updatedProject = {
					...project,
					cost: project.cost || 0,
					reportid: project.reportid,
				};
				console.log("Updated project:", updatedProject);
				dispatch(updateProject(updatedProject));
				setIsEditing(false);
				navigate("/home/projects");
			}
		}
	};

	// Функция отмены редактирования
	const handleCancel = () => {
		setIsEditing(false);
		const projectToEdit = projects.find((p) => p.id.toString() === projectId);
		setProject(projectToEdit);
		setError(false);
	};

	// Функция удаления проекта
	const handleDelete = () => {
		dispatch(deleteProject(projectId));
		navigate("/home/projects");
		setOpenDeleteDialog(false);
	};

	// Функция открытия последнего отчета
	const handleOpenReport = () => {
		console.log(reports, currentReport, project);
		if (currentReport) {
			navigate(`/home/projects/${projectId}/report/${currentReport.id}`);
		}
	};

	// Если проект еще не загружен
	if (!project) return <Typography>Loading...</Typography>;

	return (
		<Box>
			<MainHeader />
			<Box sx={{ padding: "24px 32px" }}>
				<Breadcrumbs aria-label="breadcrumb">
					<Link
						underline="hover"
						color="inherit"
						href="/home">
						Main
					</Link>
					<Link
						underline="hover"
						color="inherit"
						href="/home/projects">
						Projects
					</Link>
					<Typography sx={{ color: theme.palette.black.main }}>
						{project.projectname}
					</Typography>
				</Breadcrumbs>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: "10px",
						marginTop: "40px",
					}}>
					<IconButton
						onClick={() => navigate(`/home/projects`)}
						edge="start"
						aria-label="back">
						<ArrowBackIcon />
					</IconButton>
					<Typography
						variant="h4"
						component="h3"
						fontWeight="500">
						{isEditing ? "Edit Project" : "Project Details"}
					</Typography>
				</Box>
			</Box>

			{isEditing ? (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
						padding: "0 32px",
						width: "50vw",
					}}>
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
									gap: "15vw",
								}}>
								<Typography color="error">
									Project name and client name are required
								</Typography>
								<IconButton onClick={() => setError(false)}>
									<ClearIcon color="error" />
								</IconButton>
							</Box>
						</Alert>
					)}
					<TextField
						name="projectname"
						label="Project Name"
						variant="outlined"
						sx={{ width: "100%" }}
						value={project.projectname}
						onChange={(e) =>
							setProject({ ...project, projectname: e.target.value })
						}
						required
					/>
					<TextField
						name="clientname"
						label="Client Name"
						variant="outlined"
						sx={{ width: "100%" }}
						value={project.clientname}
						onChange={(e) =>
							setProject({ ...project, clientname: e.target.value })
						}
						required
					/>
					<TextField
						name="projectdescription"
						label="Project Description"
						variant="outlined"
						multiline
						rows={3}
						sx={{
							width: "100%",
							maxWidth: "100%",
							minHeight: "100px",
							resize: "none",
						}}
						value={project.projectdescription}
						onChange={(e) =>
							setProject({ ...project, projectdescription: e.target.value })
						}
					/>
					<Select
						name="projectstatus"
						sx={{ width: "100%" }}
						value={project.projectstatus}
						label="Status"
						onChange={(e) =>
							setProject({ ...project, projectstatus: e.target.value })
						}
						required>
						<MenuItem value="active">Active</MenuItem>
						<MenuItem value="inactive">Inactive</MenuItem>
					</Select>
					<TextField
						name="closeddate"
						label="Closed Date"
						variant="outlined"
						sx={{ width: "100%" }}
						type="date"
						value={formatDate(project.closeddate) || formatDate(closedDate)}
						onChange={(e) =>
							setProject({ ...project, closeddate: e.target.value })
						}
						InputLabelProps={{ shrink: true }}
					/>
					<Box sx={{ marginTop: "20px", display: "flex", gap: "20px" }}>
						<Button
							variant="contained"
							size="normal"
							onClick={handleSave}
							color="success">
							Save Changes
						</Button>
						<Button
							variant="outlined"
							size="normal"
							onClick={handleCancel}>
							Cancel
						</Button>
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "20px",
						padding: "24px 32px",
						maxWidth: "700px",
					}}>
					<Box>
						<Typography
							variant="h5"
							sx={{ fontWeight: "600" }}>
							{project.projectname}
						</Typography>
						<Typography
							variant="body1"
							sx={{ color: theme.palette.custom.dark_gray }}>
							<strong>Client:</strong> {project.clientname}
						</Typography>
						<Typography
							variant="body2"
							sx={{ marginTop: "8px" }}>
							<strong>Description:</strong> {project.projectdescription}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography sx={{ fontWeight: "500", marginRight: "8px" }}>
								<strong>Status:</strong>
							</Typography>
							{project.projectstatus === "active" ? (
								<CheckCircleIcon
									sx={{
										width: 24,
										height: 24,
										color: theme.palette.success.main,
									}}
								/>
							) : (
								<CancelIcon
									sx={{
										width: 24,
										height: 24,
										color: theme.palette.error.main,
									}}
								/>
							)}
						</Box>
					</Box>

					{currentReport && currentReport.id && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "16px 0px",
								borderTop: "1px solid",
								borderBottom: "1px solid",
								borderColor: theme.palette.custom.dark_gray,
							}}>
							<Typography
								variant="h4"
								sx={{ fontWeight: "700" }}>
								<strong>Total Cost:</strong> $
								{(currentReport && currentReport.totalcost) || project.cost}
							</Typography>
							<Button
								variant="contained"
								onClick={handleOpenReport}>
								View Latest Report
							</Button>
						</Box>
					)}

					<Box sx={{ display: "flex", gap: "20px" }}>
						<Typography variant="body1">
							<strong>Created Date: </strong>
							{formatDate(project.createddate)}
						</Typography>
						<Typography variant="body1">
							<strong>Closed Date: </strong>
							{formatDate(project.closeddate) || "N/A"}
						</Typography>
					</Box>

					<Box sx={{ display: "flex", gap: "16px" }}>
						<Button
							variant="contained"
							size="normal"
							onClick={() => setIsEditing(true)}
							color={theme.palette.secondary.main}>
							Edit Project
						</Button>
						<Button
							variant="outlined"
							size="normal"
							onClick={() => setOpenDeleteDialog(true)}
							color="error">
							Delete Project
						</Button>
					</Box>
				</Box>
			)}
			<DeleteDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				onSubmit={handleDelete}
			/>
		</Box>
	);
};

export default EditProject;
