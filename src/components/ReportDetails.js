import React, { useEffect } from "react";
import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchReportByProjectId } from "../store/reportsSlice";
import MainHeader from "./MainHeader";

const ReportDetails = () => {
	const { projectId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { reports, status, error } = useSelector((state) => state.reports);

	const report = reports.find((r) => r.projectid === parseInt(projectId, 10));

	useEffect(() => {
		if (!report) {
			dispatch(fetchReportByProjectId(projectId));
		}
	}, [projectId, report, dispatch]);

	if (status === "loading") {
		return <Typography>Loading report...</Typography>;
	}

	if (status === "failed") {
		return <Typography color="error">{error}</Typography>;
	}

	if (!report) {
		return <Typography>No report found for this project.</Typography>;
	}

	return (
		<Box>
			<MainHeader />
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
				<Link
					underline="hover"
					color="inherit"
					href={`/home/projects/${projectId}`}>
					Project
				</Link>
				<Typography sx={{ color: "text.primary" }}>
					{report.reportname}
				</Typography>
			</Breadcrumbs>
			<Box sx={{ padding: "16px 32px" }}>
				<Typography
					variant="h4"
					gutterBottom>
					Report Details
				</Typography>
				<Typography variant="body1">
					<strong>Report Name:</strong> {report.reportname}
				</Typography>
				<Typography variant="body1">
					<strong>Total Cost: </strong> {report.totalcost} $
				</Typography>
				<Typography variant="body1">
					<strong>Created Date:</strong> {report.reportcreateddate}
				</Typography>
				<Typography variant="body1">
					<strong>Author:</strong> {report.reportauthor}
				</Typography>
				<Button
					variant="outlined"
					color="primary"
					sx={{ marginTop: "16px" }}
					onClick={() => navigate(`/home/projects/${projectId}`)}>
					Back to Project
				</Button>
			</Box>
		</Box>
	);
};

export default ReportDetails;
