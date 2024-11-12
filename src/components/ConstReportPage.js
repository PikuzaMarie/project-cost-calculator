import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CostReportForm from "./CostReportForm";
import { Box, Typography } from "@mui/material";
import MainHeader from "./MainHeader";

const CostReportPage = () => {
	const { projectId } = useParams();
	const [project, setProject] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
		const project = storedProjects.find((p) => p.id === parseInt(projectId));
		setProject(project);
	}, [projectId]);

	const handleSaveReport = (report) => {
		const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

		const updatedProjects = storedProjects.map((p) =>
			p.id === parseInt(projectId)
				? { ...p, reports: [...p.reports, report], cost: report.totalCost }
				: p
		);

		localStorage.setItem("projects", JSON.stringify(updatedProjects));

		navigate(`/home/projects/${projectId}`);
	};

	if (!project) {
		return <Typography>Project not found...</Typography>;
	}

	return (
		<Box>
			<MainHeader />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "40px",
					padding: "20px",
				}}>
				<Typography
					variant="h4"
					component="h2">
					Create Report for {project.projectName}
				</Typography>

				<CostReportForm
					onSaveReport={handleSaveReport}
					onClose={() => navigate(`/home/projects/${projectId}`)}
				/>
			</Box>
		</Box>
	);
};

export default CostReportPage;
