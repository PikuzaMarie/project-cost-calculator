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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MainHeader from "./MainHeader";

const EditProject = () => {
	const navigate = useNavigate();
	const { projectId } = useParams();
	const [project, setProject] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const projects = JSON.parse(localStorage.getItem("projects")) || [];
		const projectToEdit = projects.find((p) => p.id.toString() === projectId);
		if (projectToEdit) {
			setProject(projectToEdit);
		}
	}, [projectId]);

	const handleSave = () => {
		const projects = JSON.parse(localStorage.getItem("projects")) || [];
		const updatedProjects = projects.map((p) =>
			p.id.toString() === projectId ? project : p
		);
		localStorage.setItem("projects", JSON.stringify(updatedProjects));
		setIsEditing(false);
	};

	const handleCancel = () => {
		const projects = JSON.parse(localStorage.getItem("projects")) || [];
		const originalProject = projects.find((p) => p.id.toString() === projectId);
		setProject(originalProject);
		setIsEditing(false);
	};

	const handleDelete = () => {
		const projects = JSON.parse(localStorage.getItem("projects")) || [];
		const updatedProjects = projects.filter(
			(p) => p.id.toString() !== projectId
		);
		localStorage.setItem("projects", JSON.stringify(updatedProjects));
		navigate("/home/projects");
	};

	const handleOpenReport = () => {
		const reportId =
			project.reports && project.reports.length > 0
				? project.reports[project.reports.length - 1].reportId
				: null;
		if (reportId) {
			navigate(`/home/projects/${projectId}/report/${reportId}`);
		}
	};

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
						{project.projectName}
					</Typography>
				</Breadcrumbs>
				<Typography
					variant="h5"
					component="h3"
					sx={{ marginTop: "20px" }}>
					{isEditing ? "Edit Project" : "View Project"}
				</Typography>
			</Box>

			{isEditing ? (
				// Режим редактирования
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
						padding: "0 32px",
						width: "50vw",
					}}>
					<TextField
						label="Project Name"
						variant="outlined"
						sx={{ width: "400px" }}
						value={project.projectName}
						onChange={(e) =>
							setProject({ ...project, projectName: e.target.value })
						}
					/>
					<TextField
						label="Client Name"
						variant="outlined"
						sx={{ width: "400px" }}
						value={project.clientName}
						onChange={(e) =>
							setProject({ ...project, clientName: e.target.value })
						}
					/>
					<TextField
						label="Project Description"
						variant="outlined"
						sx={{ width: "400px" }}
						value={project.projectDescription}
						onChange={(e) =>
							setProject({ ...project, projectDescription: e.target.value })
						}
					/>

					<InputLabel id="select-label">Status</InputLabel>
					<Select
						labelId="select-label"
						sx={{ width: "400px" }}
						value={project.projectStatus}
						label="Status"
						onChange={(e) =>
							setProject({ ...project, projectStatus: e.target.value })
						}
						required>
						<MenuItem value="active">Active</MenuItem>
						<MenuItem value="inactive">Inactive</MenuItem>
					</Select>
					<TextField
						label="Closed Date"
						variant="outlined"
						sx={{ width: "400px" }}
						type="date"
						value={project.closedDate}
						onChange={(e) =>
							setProject({ ...project, closedDate: e.target.value })
						}
						InputLabelProps={{ shrink: true }}
					/>
					<Box
						sx={{
							marginTop: "20px",
							display: "flex",
							gap: "20px",
						}}>
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
				// Режим просмотра
				<Box sx={{ padding: "0 32px" }}>
					<Typography variant="body1">
						<strong>Project Name:</strong> {project.projectName}
					</Typography>
					<Typography variant="body1">
						<strong>Client Name:</strong> {project.clientName}
					</Typography>
					<Typography variant="body1">
						<strong>Description:</strong> {project.projectDescription}
					</Typography>
					<Typography variant="body1">
						<strong>Status:</strong> {project.projectStatus}
					</Typography>
					{project.cost && (
						<Typography
							variant="body1"
							sx={{ marginTop: "20px" }}>
							<strong>Total Cost:</strong> ${project.cost}
						</Typography>
					)}
					{project.reports && project.reports.length > 0 && (
						<Box sx={{ marginTop: "20px" }}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleOpenReport}>
								Open Latest Report
							</Button>
						</Box>
					)}
					<Typography variant="body1">
						<strong>Created Date:</strong> {project.createdDate}
					</Typography>
					<Typography variant="body1">
						<strong>Closed Date:</strong> {project.closedDate}
					</Typography>
					<Box
						sx={{
							marginTop: "20px",
							display: "flex",
							gap: "20px",
						}}>
						<Button
							variant="contained"
							color="primary"
							onClick={() => setIsEditing(true)}>
							Edit
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={handleDelete}>
							Delete
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default EditProject;
