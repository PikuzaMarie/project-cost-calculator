import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button,
	Box,
} from "@mui/material";

const DeleteDialog = ({ open, onClose, onSubmit }) => {
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
				Confirm deletion
			</DialogTitle>
			<DialogContent
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					gap: "10px",
					width: "600px",
				}}>
				<Typography variant="body1">
					Do you really want to delete this project?
				</Typography>
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
						variant="containedError"
						onClick={onSubmit}>
						Confirm
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteDialog;
