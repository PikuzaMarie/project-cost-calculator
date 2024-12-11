import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Typography,
	Box,
} from "@mui/material";

const CreateProjectForm = ({ open, onClose, onSubmit }) => {
	const [projectName, setProjectName] = useState("");
	const [clientName, setClientName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [createdDate, setCreatedDate] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (open) {
			const today = new Date().toISOString().split("T")[0];
			setCreatedDate(today);
		}
	}, [open]);

	const handleSubmit = () => {
		if (!projectName || !clientName || !createdDate) {
			setError("All fields are required.");
			return;
		}
		setError("");

		const newProject = {
			projectname: projectName,
			clientname: clientName,
			projectdescription: projectDescription,
			projectstatus: "active",
			createddate: createdDate,
			cost: 0,
			reportid: null,
		};
		onSubmit(newProject);
		resetForm();
	};

	const resetForm = () => {
		setProjectName("");
		setClientName("");
		setProjectDescription("");
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			sx={{
				padding: "16px",
			}}>
			<DialogTitle
				variant="h5"
				fontWeight="600">
				Create a new project
			</DialogTitle>
			<DialogContent
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					gap: "10px",
					width: "600px",
				}}>
				{error && (
					<Typography
						variant="body2"
						color="error">
						{error}
					</Typography>
				)}
				<TextField
					name="projectname"
					autoFocus
					margin="dense"
					label="Project Name"
					value={projectName}
					onChange={(e) => setProjectName(e.target.value)}
					required
				/>
				<TextField
					name="clientname"
					margin="dense"
					label="Client Name"
					value={clientName}
					onChange={(e) => setClientName(e.target.value)}
					required
				/>
				<TextField
					name="projectdescription"
					margin="dense"
					label="Project Description"
					multiline
					value={projectDescription}
					onChange={(e) => setProjectDescription(e.target.value)}
				/>
				<TextField
					name="createddate"
					margin="dense"
					label="Created Date"
					type="date"
					value={createdDate}
					onChange={(e) => setCreatedDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
					required
				/>
			</DialogContent>
			<DialogActions>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						gap: "16px",
					}}>
					<Button
						variant="outlined"
						onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleSubmit}>
						Create Project
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
};

export default CreateProjectForm;
