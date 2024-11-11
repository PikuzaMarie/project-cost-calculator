import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Select,
	MenuItem,
	InputLabel,
} from "@mui/material";

const CreateProjectForm = ({ open, onClose, onSubmit }) => {
	// Состояния для полей формы
	const [projectName, setProjectName] = useState("");
	const [clientName, setClientName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectStatus, setProjectStatus] = useState("");
	const [createdDate, setCreatedDate] = useState("");
	const [closedDate, setClosedDate] = useState("");

	// Обработчик отправки формы
	const handleSubmit = () => {
		const newProject = {
			projectName,
			clientName,
			projectDescription,
			projectStatus,
			createdDate,
			closedDate,
			reports: [], // Пустой список отчетов для нового проекта
		};
		onSubmit(newProject); // Передаем данные родительскому компоненту
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}>
			<DialogTitle>Create a new project</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Project Name"
					fullWidth
					value={projectName}
					onChange={(e) => setProjectName(e.target.value)}
					required
				/>
				<TextField
					margin="dense"
					label="Client Name"
					fullWidth
					value={clientName}
					onChange={(e) => setClientName(e.target.value)}
					required
				/>
				<TextField
					margin="dense"
					label="Project Description"
					fullWidth
					multiline
					value={projectDescription}
					onChange={(e) => setProjectDescription(e.target.value)}
				/>
				<InputLabel id="select-label">Status</InputLabel>
				<Select
					labelId="select-label"
					fullWidth
					value={projectStatus}
					label="Status"
					onChange={(e) => setProjectStatus(e.target.value)}
					required>
					<MenuItem value="active">Active</MenuItem>
					<MenuItem value="inactive">Inactive</MenuItem>
				</Select>
				<TextField
					margin="dense"
					label="Created Date"
					fullWidth
					type="date"
					value={createdDate}
					onChange={(e) => setCreatedDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					margin="dense"
					label="Closed Date"
					fullWidth
					type="date"
					value={closedDate}
					onChange={(e) => setClosedDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={onClose}
					color="primary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					color="primary">
					Create Project
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateProjectForm;
