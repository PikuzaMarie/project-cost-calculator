import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createOrUpdateReport,
	fetchReportByProjectId,
} from "../store/slices/reportsSlice";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TeamForm from "./TeamForm";

const CreateReportForm = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//Get reports from store
	const projects = useSelector((state) => state.projects.projects || []);
	const project = projects.find((p) => p.id === parseInt(projectId, 10));
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
	const [devCost, setDevCost] = useState(0);
	const [additionalCost, setAdditionalCost] = useState(0);
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
			setEquipmentDepreciation(report.deprecationcost || 0);
			setServiceSubscriptions(report.subscriptioncost || 0);
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
		setDevCost(
			projectManagerCost + analystCost + designCost + developerCost + testCost
		);
		setAdditionalCost(customFieldsAmount);
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
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		const reportDate = now.toISOString().split("T")[0];

		const reportData = {
			reportname: reportName,
			totalcost: totalCost,
			reportcreateddate: reportdate,
			budget: parseInt(budget),
			devcost: devCost,
			deprecationcost: parseInt(equipmentDepreciation),
			subscriptioncost: parseInt(serviceSubscriptions),
			additionalcost: additionalCost,
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

	const handleNumericChange = (e, setter) => {
		const value = e.target.value;
		const regex = /^\d*\.?\d*$/;
		if (regex.test(value)) {
			setter(value);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "30px",
				maxWidth: "600px",
				margin: "40px auto",
			}}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					textAlign: "center",
				}}>
				<Typography
					variant="h4"
					fontWeight="600">
					{report ? "Edit Report" : "Create Report"}
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						textAlign: "left",
					}}>
					<Typography variant="subtitle1">
						<strong>Project: </strong>
						{project.projectname}
					</Typography>
					<Typography variant="subtitle1">
						<strong>Client: </strong>
						{project.clientname}
					</Typography>
				</Box>
			</Box>

			{error && (
				<Typography
					color="error"
					mb={2}>
					{error}
				</Typography>
			)}
			<Box sx={{ display: "flex", flexDirection: "column", gap: "35px" }}>
				<Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					<TextField
						label="Report Name"
						value={reportName}
						onChange={(e) => setReportName(e.target.value)}
						required
					/>
					<TextField
						label="Budget"
						value={budget.toString()}
						variant="filled"
						onChange={(e) => handleNumericChange(e, setBudget)}
						required
					/>
				</Box>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}>
					<Typography variant="h6">Project Manager</Typography>
					<Box
						sx={{
							display: "flex",
							gap: "8px",
						}}>
						<TextField
							label="Hourly Rate"
							value={projectManager.hourlyRate}
							variant="filled"
							onChange={(e) => {
								handleNumericChange(e, (value) => {
									setProjectManager({ ...projectManager, hourlyRate: value });
								});
								calculateTotalCost();
							}}
							required
						/>
						<TextField
							label="Hours Worked"
							value={projectManager.hoursWorked}
							variant="filled"
							onChange={(e) => {
								handleNumericChange(e, (value) => {
									setProjectManager({
										...projectManager,
										hoursWorked: value,
									});
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
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}>
					<TextField
						label="Equipment Depreciation"
						value={equipmentDepreciation.toString()}
						variant="filled"
						onChange={(e) => {
							handleNumericChange(e, setEquipmentDepreciation);
							calculateTotalCost();
						}}
						required
					/>
					<TextField
						label="Service Subscriptions"
						value={serviceSubscriptions.toString()}
						variant="filled"
						onChange={(e) => {
							handleNumericChange(e, setServiceSubscriptions);
							calculateTotalCost();
						}}
						required
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}>
					{customFields.map((field, index) => (
						<Box
							key={index}
							sx={{ display: "flex", gap: "8px" }}>
							<TextField
								label="Description"
								value={field.description}
								onChange={(e) => {
									const newFields = [...customFields];
									newFields[index].description = e.target.value;
									setCustomFields(newFields);
								}}
								sx={{ width: "50%" }}
							/>
							<TextField
								label="Amount"
								value={field.amount.toString()}
								variant="filled"
								onChange={(e) =>
									handleNumericChange(e, (value) => {
										const newFields = [...customFields];
										newFields[index].amount = e.target.value;
										setCustomFields(newFields);
										calculateTotalCost();
									})
								}
								sx={{ width: "50%" }}
							/>
						</Box>
					))}
					<Button
						variant="outlined"
						onClick={() => {
							setCustomFields([
								...customFields,
								{ description: "", amount: "" },
							]);
						}}
						sx={{ width: "100%" }}>
						Add Custom Field
					</Button>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}>
					{report && report.totalcost && (
						<Typography variant="h5">
							<strong>Previous Cost: </strong>
							{report.totalcost}
						</Typography>
					)}
					<Typography variant="h5">
						<strong>Total Cost: </strong>
						{totalCost}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}>
					<Button
						type="submit"
						variant="contained"
						sx={{ width: "100%" }}>
						Save Report
					</Button>
					<Button
						variant="outlined"
						onClick={() => navigate(`/home/projects`)}
						sx={{ width: "100%" }}>
						Cancel
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default CreateReportForm;
