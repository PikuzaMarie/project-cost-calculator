import React, { useState } from "react";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	TextField,
	Box,
	Typography,
	IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const CostReportForm = ({ onSaveReport, onClose }) => {
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		budget: "",
		devTeam: { count: 0, rate: 0, hours: 0 },
		analyticsTeam: { count: 0, rate: 0, hours: 0 },
		designTeam: { count: 0, rate: 0, hours: 0 },
		testingTeam: { count: 0, rate: 0, hours: 0 },
		projectManager: { rate: 0, hours: 0 },
		equipmentCosts: { depreciation: 0, services: 0 },
		customCosts: [],
	});

	const steps = ["Budget & Team", "Equipment Costs", "Custom Costs"];

	const handleNext = () => {
		setActiveStep((prevStep) => prevStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		// Преобразуем в число (если значение числа)
		const numericValue =
			name === "budget" ||
			name.includes("rate") ||
			name.includes("hours") ||
			name.includes("depreciation") ||
			name.includes("services")
				? Number(value)
				: value;

		// Проверяем, нужно ли обновить вложенный объект (equipmentCosts)
		if (name in formData.equipmentCosts) {
			setFormData((prevData) => ({
				...prevData,
				equipmentCosts: {
					...prevData.equipmentCosts,
					[name]: numericValue, // Обновляем только нужное поле
				},
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: numericValue,
			}));
		}
	};

	const handleTeamChange = (e, team) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[team]: {
				...prevData[team],
				[name]: value,
			},
		}));
	};

	const handleAddCustomCost = () => {
		setFormData((prevData) => ({
			...prevData,
			customCosts: [...prevData.customCosts, { description: "", amount: "" }],
		}));
	};

	const handleCustomCostChange = (e, index) => {
		const { name, value } = e.target;
		const updatedCustomCosts = [...formData.customCosts];
		updatedCustomCosts[index] = {
			...updatedCustomCosts[index],
			[name]: value,
		};
		setFormData((prevData) => ({
			...prevData,
			customCosts: updatedCustomCosts,
		}));
	};

	const handleDeleteCustomCost = (index) => {
		const updatedCustomCosts = formData.customCosts.filter(
			(cost, i) => i !== index
		);
		setFormData((prevData) => ({
			...prevData,
			customCosts: updatedCustomCosts,
		}));
	};

	const calculateCost = () => {
		const {
			devTeam,
			analyticsTeam,
			designTeam,
			testingTeam,
			projectManager,
			equipmentCosts,
			customCosts,
		} = formData;

		const totalTeamCost =
			Number(devTeam.count) * Number(devTeam.rate) * Number(devTeam.hours) +
			Number(analyticsTeam.count) *
				Number(analyticsTeam.rate) *
				Number(analyticsTeam.hours) +
			Number(designTeam.count) *
				Number(designTeam.rate) *
				Number(designTeam.hours) +
			Number(testingTeam.count) *
				Number(testingTeam.rate) *
				Number(testingTeam.hours) +
			Number(projectManager.rate) * Number(projectManager.hours);

		const equipmentCost =
			Number(equipmentCosts.depreciation) + Number(equipmentCosts.services);

		const customCost = customCosts.reduce(
			(acc, cost) => acc + (Number(cost.amount) || 0), // Обрабатываем возможно пустые или нечисловые значения
			0
		);

		return totalTeamCost + equipmentCost + customCost;
	};

	const handleSaveReport = () => {
		const report = {
			reportId: new Date().getTime(), // Генерация уникального ID для отчёта
			reportName: "Report X", // Название отчёта
			budget: Number(formData.budget), // Преобразуем бюджет в число
			totalTeamCost: calculateCost(), // Вычисленная стоимость
			equipmentCost:
				Number(formData.equipmentCosts.depreciation) +
				Number(formData.equipmentCosts.services),
			customCost: formData.customCosts.reduce(
				(acc, cost) => acc + (Number(cost.amount) || 0),
				0
			),
			totalCost:
				calculateCost() +
				Number(formData.equipmentCosts.depreciation) +
				Number(formData.equipmentCosts.services) +
				formData.customCosts.reduce(
					(acc, cost) => acc + (Number(cost.amount) || 0),
					0
				),
		};

		// Сохраняем отчёт в проект
		onSaveReport(report);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Stepper
				activeStep={activeStep}
				alternativeLabel>
				{steps.map((label, index) => (
					<Step key={index}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			<Box sx={{ padding: "20px" }}>
				{activeStep === 0 && (
					<Box>
						<Typography variant="h6">Fill in Budget & Team</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<TextField
								label="Budget"
								variant="outlined"
								fullWidth
								name="budget"
								value={formData.budget}
								onChange={handleChange}
								required
								type="number"
							/>

							{/* Development Team */}
							<TextField
								label="Dev Team Count"
								variant="outlined"
								fullWidth
								name="count"
								value={formData.devTeam.count}
								onChange={(e) => handleTeamChange(e, "devTeam")}
								required
								type="number"
							/>
							<TextField
								label="Dev Team Rate"
								variant="outlined"
								fullWidth
								name="rate"
								value={formData.devTeam.rate}
								onChange={(e) => handleTeamChange(e, "devTeam")}
								required
								type="number"
							/>
							<TextField
								label="Dev Team Hours"
								variant="outlined"
								fullWidth
								name="hours"
								value={formData.devTeam.hours}
								onChange={(e) => handleTeamChange(e, "devTeam")}
								required
								type="number"
							/>

							{/* Repeat for other teams (analyticsTeam, designTeam, etc.) */}
							<TextField
								label="Analytics Team Count"
								variant="outlined"
								fullWidth
								name="count"
								value={formData.analyticsTeam.count}
								onChange={(e) => handleTeamChange(e, "analyticsTeam")}
								required
								type="number"
							/>
							<TextField
								label="Analytics Team Rate"
								variant="outlined"
								fullWidth
								name="rate"
								value={formData.analyticsTeam.rate}
								onChange={(e) => handleTeamChange(e, "analyticsTeam")}
								required
								type="number"
							/>
							<TextField
								label="Analytics Team Hours"
								variant="outlined"
								fullWidth
								name="hours"
								value={formData.analyticsTeam.hours}
								onChange={(e) => handleTeamChange(e, "analyticsTeam")}
								required
								type="number"
							/>
							{/* Add other teams (designTeam, testingTeam, projectManager) similarly */}
						</Box>
					</Box>
				)}

				{activeStep === 1 && (
					<Box>
						<Typography variant="h6">Equipment Costs</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<TextField
								label="Depreciation"
								variant="outlined"
								fullWidth
								name="depreciation"
								value={formData.equipmentCosts.depreciation}
								onChange={handleChange}
								required
								type="number"
							/>
							<TextField
								label="Services"
								variant="outlined"
								fullWidth
								name="services"
								value={formData.equipmentCosts.services}
								onChange={handleChange}
								required
								type="number"
							/>
						</Box>
					</Box>
				)}

				{activeStep === 2 && (
					<Box>
						<Typography variant="h6">Custom Costs</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{formData.customCosts.map((customCost, index) => (
								<Box
									key={index}
									sx={{ display: "flex", gap: 2 }}>
									<TextField
										label="Description"
										variant="outlined"
										name="description"
										value={customCost.description}
										onChange={(e) => handleCustomCostChange(e, index)}
										required
									/>
									<TextField
										label="Amount"
										variant="outlined"
										name="amount"
										value={customCost.amount}
										onChange={(e) => handleCustomCostChange(e, index)}
										required
										type="number"
									/>
									<IconButton onClick={() => handleDeleteCustomCost(index)}>
										<DeleteIcon />
									</IconButton>
								</Box>
							))}
							<Button
								variant="outlined"
								onClick={handleAddCustomCost}
								startIcon={<AddIcon />}>
								Add Custom Cost
							</Button>
						</Box>
					</Box>
				)}

				<Box
					sx={{
						marginTop: "20px",
						display: "flex",
						justifyContent: "space-between",
					}}>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}>
						Back
					</Button>
					<Button
						onClick={
							activeStep === steps.length - 1 ? handleSaveReport : handleNext
						}
						variant="contained">
						{activeStep === steps.length - 1 ? "Save Report" : "Next"}
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default CostReportForm;
