import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";

const ReportPage = () => {
	const { projectId, reportId } = useParams();
	const [report, setReport] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const projects = JSON.parse(localStorage.getItem("projects")) || [];
		const project = projects.find((p) => p.id.toString() === projectId);
		if (project) {
			const foundReport = project.reports.find(
				(r) => r.reportId.toString() === reportId
			);
			setReport(foundReport);
		}
	}, [projectId, reportId]);

	const handleBackToProject = () => {
		navigate(`/home/projects/${projectId}`);
	};

	if (!report) return <Typography>Loading report...</Typography>;

	return (
		<Box>
			<MainHeader />
			<Box sx={{ padding: "32px" }}>
				<Typography
					variant="h4"
					component="h2"
					sx={{ marginBottom: "20px" }}>
					Report for {report.name}
				</Typography>
				<Typography variant="body1">
					<strong>Budget:</strong> ${report.budget}
				</Typography>
				<Typography variant="body1">
					<strong>Total Team Cost:</strong> ${report.totalTeamCost}
				</Typography>
				<Typography variant="body1">
					<strong>Equipment Cost:</strong> ${report.equipmentCost}
				</Typography>
				<Typography variant="body1">
					<strong>Custom Costs:</strong> ${report.customCost}
				</Typography>
				<Typography variant="body1">
					<strong>Total Cost:</strong> ${report.totalCost}
				</Typography>

				<Box sx={{ marginTop: "20px" }}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleBackToProject}>
						Back to Project
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default ReportPage;
