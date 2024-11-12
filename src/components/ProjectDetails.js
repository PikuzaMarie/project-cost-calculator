import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProjectDetails = ({
	projectName,
	clientName,
	projectStatus,
	projectId,
	onEditProject,
	onDeleteProject,
}) => {
	const navigate = useNavigate();

	const handleCreateReport = () => {
		navigate(`/newreport/${projectId}`);
	};

	return (
		<Box
			sx={{
				borderBottom: "1px solid #ccc",
				paddingBottom: "16px",
				marginBottom: "16px",
			}}>
			<Typography variant="h6">{projectName}</Typography>
			<Typography variant="body2">Client: {clientName}</Typography>
			<Typography variant="body2">Status: {projectStatus}</Typography>

			<Box sx={{ marginTop: "8px" }}>
				<Button
					onClick={handleCreateReport}
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
					View
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
