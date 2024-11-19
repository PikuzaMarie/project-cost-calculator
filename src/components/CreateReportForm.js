import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createOrUpdateReport,
	fetchReportByProjectId,
} from "../store/reportsSlice";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const CreateReportForm = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Отчеты из хранилища
	const reports = useSelector((state) => state.reports.reports || []);
	const report = reports.find((r) => r.projectId === projectId);
	const employeeId = 1; //нужно переписать на динамическое получение Id

	// Локальные состояния для формы
	const [reportName, setReportName] = useState("");
	const [totalCost, setTotalCost] = useState("");
	const [error, setError] = useState("");

	// Загружаем отчет при монтировании компонента
	useEffect(() => {
		if (projectId && !report) {
			dispatch(fetchReportByProjectId(projectId));
		}
	}, [dispatch, projectId, report]);

	// Заполняем поля формы, если отчет уже загружен
	useEffect(() => {
		if (report) {
			setReportName(report.reportname || "");
			setTotalCost(report.totalcost ? report.totalcost.toString() : "");
		} else {
			setReportName("");
			setTotalCost("");
		}
	}, [report]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!reportName || !totalCost) {
			setError("All fields are required!");
			return;
		}

		// Проверка на правильность totalCost
		if (isNaN(parseFloat(totalCost))) {
			setError("Total Cost must be a valid number");
			return;
		}

		// Создаем объект report с необходимыми данными
		const reportData = {
			reportname: reportName,
			totalcost: parseFloat(totalCost),
			reportauthor: employeeId,
		};

		try {
			// Передаем объект report в createOrUpdateReport
			await dispatch(createOrUpdateReport({ projectId, report: reportData }));

			// Перенаправление на страницу проекта после успешного создания/обновления отчета
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
				label="Total Cost"
				fullWidth
				margin="normal"
				type="number"
				value={totalCost}
				onChange={(e) => setTotalCost(e.target.value)}
				required
			/>
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
