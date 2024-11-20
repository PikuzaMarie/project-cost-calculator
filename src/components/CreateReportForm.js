import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createOrUpdateReport,
	fetchReportByProjectId,
} from "../store/reportsSlice";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TeamForm from "./TeamForm";

const CreateReportForm = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//Get reports from store
	const reports = useSelector((state) => state.reports.reports || []);
	const report = reports.find((r) => r.projectid === parseInt(projectId, 10));

	const [reportName, setReportName] = useState("");
	const [budget, setBudget] = useState(0);
	const [projectManager, setProjectManager] = useState({
		hourlyRate: "",
		hoursWorked: "",
	});
	const [developerTeam, setDeveloperTeam] = useState([
		{ developers: "", hourlyRate: "", hoursWorked: "" },
	]);
	const [analystTeam, setAnalystTeam] = useState([
		{ analysts: "", hourlyRate: "", hoursWorked: "" },
	]);
	const [designTeam, setDesignTeam] = useState([
		{ designers: "", hourlyRate: "", hoursWorked: "" },
	]);
	const [testTeam, setTestTeam] = useState([
		{ testers: "", hourlyRate: "", hoursWorked: "" },
	]);
	const [equipmentDepreciation, setEquipmentDepreciation] = useState("");
	const [serviceSubscriptions, setServiceSubscriptions] = useState("");
	const [customFields, setCustomFields] = useState([
		{ description: "", amount: "" },
	]);
	const [totalCost, setTotalCost] = useState(0);
	const [error, setError] = useState("");

	// Load info when component is mounted
	useEffect(() => {
		if (projectId && !report) {
			dispatch(fetchReportByProjectId(projectId));
		}
	}, [dispatch, projectId, report]);

	// Fill in fields if report already exists
	useEffect(() => {
		if (report) {
			setReportName(report.reportname || "");
			setBudget(report.budget ? report.budget.toString() : "");
			setTotalCost(report.totalcost || 0);
		} else {
			setReportName("");
			setBudget("");
			setTotalCost(0);
		}
	}, [report]);

	// Calculate total cost
	const calculateTotalCost = () => {
		let projectManagerCost =
			projectManager.hoursWorked * projectManager.hourlyRate;
		let analystCost = analystTeam.reduce((acc, analyst) => {
			const analysts = parseInt(analyst.analysts) || 0;
			const hourlyRate = parseInt(analyst.hourlyRate) || 0;
			const hoursWorked = parseInt(analyst.hoursWorked) || 0;
			return acc + analysts * hourlyRate * hoursWorked;
		}, 0);

		let developerCost = developerTeam.reduce((acc, dev) => {
			const developers = parseInt(dev.developers) || 0;
			const hourlyRate = parseInt(dev.hourlyRate) || 0;
			const hoursWorked = parseInt(dev.hoursWorked) || 0;
			return acc + developers * hourlyRate * hoursWorked;
		}, 0);

		let designCost = designTeam.reduce((acc, designer) => {
			const designers = parseInt(designer.designers) || 0;
			const hourlyRate = parseInt(designer.hourlyRate) || 0;
			const hoursWorked = parseInt(designer.hoursWorked) || 0;
			return acc + designers * hourlyRate * hoursWorked;
		}, 0);

		let testCost = testTeam.reduce((acc, tester) => {
			const testers = parseInt(tester.testers) || 0;
			const hourlyRate = parseInt(tester.hourlyRate) || 0;
			const hoursWorked = parseInt(tester.hoursWorked) || 0;
			return acc + testers * hourlyRate * hoursWorked;
		}, 0);

		let equipmentDepreciationAmount = parseInt(equipmentDepreciation) || 0;
		let serviceSubscriptionsAmount = parseInt(serviceSubscriptions) || 0;

		let customFieldsAmount = customFields.reduce((acc, field) => {
			const amount = parseInt(field.amount) || 0;
			return acc + amount;
		}, 0);

		setTotalCost(
			projectManagerCost +
				analystCost +
				designCost +
				developerCost +
				testCost +
				equipmentDepreciationAmount +
				serviceSubscriptionsAmount +
				customFieldsAmount
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!reportName || !budget) {
			setError("Report name and budget are required");
			return;
		}

		// Validate total cost
		if (isNaN(totalCost) || totalCost <= 0) {
			setError("Total Cost must be a valid number greater than zero.");
			return;
		}

		const reportdate = new Date().toISOString().split("T")[0];

		const reportData = {
			reportname: reportName,
			totalcost: totalCost,
			reportcreateddate: reportdate,
			budget: parseInt(budget),
		};

		try {
			console.log("Dispatching report:", reportData);
			dispatch(createOrUpdateReport({ projectId, report: reportData }));
			console.log("Redux state after save:", reports);

			navigate(`/home/projects/${projectId}`);
		} catch (err) {
			setError("An error occurred while saving the report.");
			console.error(err);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ padding: "16px", maxWidth: "600px", margin: "auto" }}>
			<Typography
				variant="h5"
				mb={2}>
				{report ? "Edit Report" : "Create Report"} for Project ID: {projectId}
			</Typography>
			{error && (
				<Typography
					color="error"
					mb={2}>
					{error}
				</Typography>
			)}
			<TextField
				label="Report Name"
				fullWidth
				margin="normal"
				value={reportName}
				onChange={(e) => setReportName(e.target.value)}
				required
			/>
			<TextField
				label="Budget"
				fullWidth
				margin="normal"
				type="number"
				value={budget.toString()}
				onChange={(e) => {
					setBudget(e.target.value);
					calculateTotalCost();
				}}
				required
			/>
			<Box sx={{ marginBottom: "20px" }}>
				<Typography
					variant="h6"
					sx={{ marginTop: "20px" }}>
					Project Manager
				</Typography>
				<Box
					sx={{
						display: "flex",
						gap: "10px",
						marginBottom: "10px",
						paddingTop: "0px",
					}}>
					<TextField
						label="Hourly Rate"
						fullWidth
						type="number"
						value={projectManager.hourlyRate}
						onChange={(e) => {
							setProjectManager({
								...projectManager,
								hourlyRate: e.target.value,
							});
							calculateTotalCost();
						}}
						required
					/>
					<TextField
						label="Hours Worked"
						fullWidth
						type="number"
						value={projectManager.hoursWorked}
						onChange={(e) => {
							setProjectManager({
								...projectManager,
								hoursWorked: e.target.value,
							});
							calculateTotalCost();
						}}
						required
					/>
				</Box>
			</Box>

			<TeamForm
				team={developerTeam}
				setTeam={setDeveloperTeam}
				calculateTotalCost={calculateTotalCost}
				teamType="developers"
			/>
			<TeamForm
				team={analystTeam}
				setTeam={setAnalystTeam}
				calculateTotalCost={calculateTotalCost}
				teamType="analysts"
			/>
			<TeamForm
				team={designTeam}
				setTeam={setDesignTeam}
				calculateTotalCost={calculateTotalCost}
				teamType="designers"
			/>
			<TeamForm
				team={testTeam}
				setTeam={setTestTeam}
				calculateTotalCost={calculateTotalCost}
				teamType="testers"
			/>
			<TextField
				label="Equipment Depreciation"
				fullWidth
				margin="normal"
				type="number"
				value={equipmentDepreciation.toString()}
				onChange={(e) => {
					setEquipmentDepreciation(e.target.value);
					calculateTotalCost();
				}}
				required
			/>
			<TextField
				label="Service Subscriptions"
				fullWidth
				margin="normal"
				type="number"
				value={serviceSubscriptions.toString()}
				onChange={(e) => {
					setServiceSubscriptions(e.target.value);
					calculateTotalCost();
				}}
				required
			/>
			{customFields.map((field, index) => (
				<Box
					key={index}
					sx={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
					<TextField
						label="Description"
						value={field.description}
						onChange={(e) => {
							const newFields = [...customFields];
							newFields[index].description = e.target.value;
							setCustomFields(newFields);
						}}
					/>
					<TextField
						label="Amount"
						value={field.amount.toString()}
						onChange={(e) => {
							const newFields = [...customFields];
							newFields[index].amount = e.target.value;
							setCustomFields(newFields);
							calculateTotalCost();
						}}
						type="number"
					/>
				</Box>
			))}
			<Button
				variant="outlined"
				onClick={() => {
					setCustomFields([...customFields, { description: "", amount: "" }]);
				}}>
				Add Custom Field
			</Button>
			{report && report.totalcost && (
				<Typography
					variant="h6"
					sx={{ marginTop: "20px" }}>
					Previous Cost: {report.totalcost}
				</Typography>
			)}
			<Typography
				variant="h6"
				sx={{ marginTop: "20px" }}>
				Total Cost: {totalCost}
			</Typography>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{ marginTop: "16px" }}>
				Save Report
			</Button>
		</Box>
	);
};

export default CreateReportForm;
