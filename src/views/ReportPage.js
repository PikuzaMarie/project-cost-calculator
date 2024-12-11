import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchReportByProjectId } from "../store/slices/reportsSlice";
import MainHeader from "../components/MainHeader";
import { Box, Typography, IconButton, Breadcrumbs, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";

const ReportDetails = () => {
	const theme = useTheme();
	const { projectId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { reports, status, error } = useSelector((state) => state.reports);

	const employee = useSelector((state) => state.employee.employee);

	const report = reports.find((r) => r.projectid === parseInt(projectId, 10));

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
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
		if (!report) {
			dispatch(fetchReportByProjectId(projectId));
		}
	}, [projectId, report, dispatch]);

	const formatDate = (date) => {
		if (!date) return "";
		const formattedDate = new Date(date);
		return formattedDate instanceof Date && !isNaN(formattedDate)
			? formattedDate.toISOString().split("T")[0]
			: "";
	};

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
			<Box
				sx={{
					padding: "24px 32px",
				}}>
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
					<Typography sx={{ color: theme.palette.black.main }}>
						Report
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
						onClick={() => navigate(`/home/projects/${projectId}`)}
						edge="start"
						aria-label="back">
						<ArrowBackIcon />
					</IconButton>
					<Typography
						variant="h4"
						component="h3"
						fontWeight="500">
						Report Details
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "16px",
					padding: "0 32px",
					width: "50vw",
				}}>
				<Typography
					variant="h5"
					sx={{ fontWeight: "600" }}>
					{report.reportname}
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						borderTop: "1px solid",
						borderBottom: "1px solid",
						borderColor: theme.palette.custom.gray,
					}}>
					<Typography
						variant="h4"
						sx={{ fontWeight: "700", marginTop: "8px" }}>
						<strong>Budget:</strong> {report.budget} $
					</Typography>
					<Typography
						variant="h4"
						sx={{ fontWeight: "700", marginTop: "8px" }}>
						<strong>Calculated cost: </strong> {report.totalcost} $
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							borderTop: "1px solid",
							borderColor: theme.palette.custom.gray,
						}}>
						<Typography
							variant="h6"
							sx={{ fontWeight: "700", marginTop: "8px" }}>
							<strong>Development cost:</strong> {report.devcost} $
						</Typography>
						<Typography
							variant="h6"
							sx={{ fontWeight: "700", marginTop: "8px" }}>
							<strong>Deprecation cost:</strong> {report.deprecationcost} $
						</Typography>
						<Typography
							variant="h6"
							sx={{ fontWeight: "700", marginTop: "8px" }}>
							<strong>Subscription cost:</strong> {report.subscriptioncost} $
						</Typography>
						<Typography
							variant="h6"
							sx={{ fontWeight: "700", marginTop: "8px" }}>
							<strong>Additional cost:</strong> {report.additionalcost} $
						</Typography>
					</Box>
				</Box>
				<Box sx={{ marginTop: "16px", display: "flex", gap: "20px" }}>
					<Typography variant="body1">
						<strong>Created date: </strong>
						{formatDate(report.reportcreateddate)}
					</Typography>
					<Typography variant="body1">
						<strong>Author: </strong>
						{employee.name}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default ReportDetails;
