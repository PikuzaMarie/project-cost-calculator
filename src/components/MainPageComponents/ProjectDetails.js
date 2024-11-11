import React from "react";
import { Button, Box, Typography } from "@mui/material";

const ProjectDetails = ({
	projectName,
	clientName,
	projectDescription,
	projectStatus,
	createdDate,
	closedDate,
	reports,
	onCreateReport,
	onEditProject,
	onDeleteProject,
}) => {
	return (
		<Box
			sx={{
				borderBottom: "1px solid #ccc",
				paddingBottom: "16px",
				marginBottom: "16px",
			}}>
			<Typography variant="h6">{projectName}</Typography>
			<Typography variant="body2">Client: {clientName}</Typography>
			<Typography variant="body2">Description: {projectDescription}</Typography>
			<Typography variant="body2">Status: {projectStatus}</Typography>
			<Typography variant="body2">Created: {createdDate}</Typography>
			<Typography variant="body2">Closed: {closedDate}</Typography>

			{/* Кнопки для взаимодействия с проектом */}
			<Box sx={{ marginTop: "8px" }}>
				<Button
					onClick={onCreateReport}
					variant="contained"
					color="primary"
					sx={{ marginRight: "8px" }}>
					Create Report
				</Button>
				<Button
					onClick={onEditProject}
					variant="outlined"
					color="secondary"
					sx={{ marginRight: "8px" }}>
					Edit
				</Button>
				<Button
					onClick={onDeleteProject}
					variant="outlined"
					color="error">
					Delete
				</Button>
			</Box>
		</Box>
	);
};

export default ProjectDetails;
