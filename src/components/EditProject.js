import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Breadcrumbs,
	Link,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import MainHeader from "./MainHeader";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchProjects,
	deleteProject,
	updateProject,
} from "../store/projectsSlice";
import { fetchAllReports } from "../store/reportsSlice";

const EditProject = () => {
	const navigate = useNavigate();
	const { projectId } = useParams();
	const dispatch = useDispatch();
	const projects = useSelector((state) => state.projects.projects);
	const [project, setProject] = useState(null);
	const reports = useSelector((state) => state.reports.reports);
	const [currentReport, setCurrentReport] = useState(null);
	const [closedDate, setClosedDate] = useState("");
	const [isEditing, setIsEditing] = useState(false);

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
			if (
				!project.projectname ||
				!project.clientname ||
				!project.projectdescription
			) {
				alert("Please fill in all required fields.");
				return;
			}
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
	};

	// Функция отмены редактирования
	const handleCancel = () => {
		setIsEditing(false);
		const projectToEdit = projects.find((p) => p.id.toString() === projectId);
		setProject(projectToEdit);
	};

	// Функция удаления проекта
	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this project?")) {
			dispatch(deleteProject(projectId));
			navigate("/home/projects");
		}
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
			<Box sx={{ padding: "16px 32px" }}>
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
					<Typography sx={{ color: "text.primary" }}>
						{project.projectname}
					</Typography>
				</Breadcrumbs>
				<Box sx={{ display: "flex", gap: "10px", marginTop: "20px" }}>
					<IconButton
						onClick={() => navigate(-1)}
						edge="start"
						color="primary"
						aria-label="back">
						<ArrowBackIcon />
					</IconButton>
					<Typography
						variant="h5"
						component="h3">
						{isEditing ? "Edit Project" : "View Project"}
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
					<TextField
						name="projectname"
						label="Project Name"
						variant="outlined"
						sx={{ width: "400px" }}
						value={project.projectname}
						onChange={(e) =>
							setProject({ ...project, projectname: e.target.value })
						}
					/>
					<TextField
						name="clientname"
						label="Client Name"
						variant="outlined"
						sx={{ width: "400px" }}
						value={project.clientname}
						onChange={(e) =>
							setProject({ ...project, clientname: e.target.value })
						}
					/>
					<TextField
						name="projectdescription"
						label="Project Description"
						variant="outlined"
						sx={{ width: "400px" }}
						value={project.projectdescription}
						onChange={(e) =>
							setProject({ ...project, projectdescription: e.target.value })
						}
					/>
					<InputLabel id="select-label">Status</InputLabel>
					<Select
						name="projectstatus"
						labelId="select-label"
						sx={{ width: "400px" }}
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
						sx={{ width: "400px" }}
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
							color="primary"
							onClick={handleSave}>
							Save Changes
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							onClick={handleCancel}>
							Cancel
						</Button>
					</Box>
				</Box>
			) : (
				<Box sx={{ padding: "0 32px" }}>
					<Typography variant="body1">
						<strong>Project Name:</strong> {project.projectname}
					</Typography>
					<Typography variant="body1">
						<strong>Client Name:</strong> {project.clientname}
					</Typography>
					<Typography variant="body1">
						<strong>Description:</strong> {project.projectdescription}
					</Typography>
					<Typography variant="body1">
						<strong>Status:</strong> {project.projectstatus}
					</Typography>
					<Typography variant="body1">
						<strong>Total Cost: </strong>
						{(currentReport && currentReport.totalcost) || project.cost} $
					</Typography>
					{currentReport && currentReport.id && (
						<Box sx={{ marginTop: "8px" }}>
							{
								<Box sx={{ marginTop: "8px", marginBottom: "8px" }}>
									<Button
										variant="contained"
										size="small"
										onClick={handleOpenReport}>
										View Latest Report
									</Button>
								</Box>
							}
						</Box>
					)}
					<Typography variant="body1">
						<strong>Created Date:</strong>{" "}
						{formatDate(project.createddate) || "N/A"}
					</Typography>
					<Typography variant="body1">
						<strong>Closed Date:</strong>{" "}
						{formatDate(project.closeddate) || "N/A"}
					</Typography>

					<Box sx={{ marginTop: "20px", display: "flex", gap: "20px" }}>
						<Button
							variant="contained"
							color="primary"
							onClick={() => setIsEditing(true)}>
							Edit Project
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							onClick={handleDelete}>
							Delete Project
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default EditProject;
