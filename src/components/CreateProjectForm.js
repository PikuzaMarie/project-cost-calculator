import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Typography,
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
		if (!projectName || !clientName || !projectDescription || !createdDate) {
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
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}>
			<DialogTitle>Create a new project</DialogTitle>
			<DialogContent>
				{error && (
					<Typography
						variant="body2"
						color="error"
						sx={{ marginBottom: "16px" }}>
						{error}
					</Typography>
				)}
				<TextField
					name="projectname"
					autoFocus
					margin="dense"
					label="Project Name"
					fullWidth
					value={projectName}
					onChange={(e) => setProjectName(e.target.value)}
					required
				/>
				<TextField
					name="clientname"
					margin="dense"
					label="Client Name"
					fullWidth
					value={clientName}
					onChange={(e) => setClientName(e.target.value)}
					required
				/>
				<TextField
					name="projectdescription"
					margin="dense"
					label="Project Description"
					fullWidth
					multiline
					value={projectDescription}
					onChange={(e) => setProjectDescription(e.target.value)}
					required
				/>
				<TextField
					name="createddate"
					margin="dense"
					label="Created Date"
					fullWidth
					type="date"
					value={createdDate}
					onChange={(e) => setCreatedDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
					required
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
