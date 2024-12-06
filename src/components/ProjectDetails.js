import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const ProjectDetails = ({
	projectName,
	clientName,
	cost,
	projectStatus,
	projectId,
	onEditProject,
	onDeleteProject,
}) => {
	const theme = useTheme();
	const navigate = useNavigate();

	const handleCreateReport = () => {
		navigate(`/home/projects/${projectId}/report`);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				width: "645px",
				padding: "24px",
				boxShadow: 3,
				"&:hover": {
					backgroundColor: theme.palette.background.main,
				},
				cursor: "pointer",
			}}>
			<Box>
				<Typography variant="h6">{projectName}</Typography>
				<Box>
					<Typography
						variant="body2"
						sx={{ color: theme.palette.custom.gray }}>
						Client: {clientName}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color:
								projectStatus === "active"
									? theme.palette.success.main
									: theme.palette.error.main,
						}}>
						Status: {projectStatus}
					</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: "8px", marginTop: "8px" }}>
					<Button
						onClick={handleCreateReport}
						variant="contained"
						disabled={projectStatus === "inactive"}>
						Create Report
					</Button>
					<Button
						onClick={onEditProject}
						variant="outlined">
						View
					</Button>
					<Button
						onClick={onDeleteProject}
						variant="outlinedError">
						Delete
					</Button>
				</Box>
			</Box>

			<Box>
				<Typography
					variant="h4"
					component="p"
					sx={{
						color:
							cost > 0
								? theme.palette.custom.black
								: theme.palette.custom.gray700,
					}}>
					{cost} $
				</Typography>
			</Box>
		</Box>
	);
};

export default ProjectDetails;
