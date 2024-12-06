import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const TeamForm = ({ team, setTeam, calculateTotalCost, teamType }) => {
	const handleChange = (index, field, value) => {
		const newTeam = [...team];
		newTeam[index][field] = value;
		setTeam(newTeam);
		calculateTotalCost();
	};

	const handleAddMember = () => {
		setTeam([
			...team,
			{ [`${teamType}`]: "", hourlyRate: "", hoursWorked: "" },
		]);
	};

	const handleNumericChange = (e, setter, index, field) => {
		const value = e.target.value;
		const regex = /^\d*\.?\d*$/;
		if (regex.test(value)) {
			setter(index, field, value);
		}
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<Typography variant="h6">
				{teamType.charAt(0).toUpperCase() + teamType.slice(1)} Team
			</Typography>
			{team.map((member, index) => (
				<Box
					key={index}
					sx={{ display: "flex", gap: "8px" }}>
					<TextField
						label="Amount"
						value={member[teamType]}
						variant="filled"
						onChange={(e) =>
							handleNumericChange(e, handleChange, index, teamType)
						}
						required
					/>
					<TextField
						label="Hourly Rate"
						value={member.hourlyRate}
						variant="filled"
						onChange={(e) =>
							handleNumericChange(e, handleChange, index, "hourlyRate")
						}
						required
					/>
					<TextField
						label="Hours Worked"
						value={member.hoursWorked}
						variant="filled"
						onChange={(e) =>
							handleNumericChange(e, handleChange, index, "hoursWorked")
						}
						required
					/>
				</Box>
			))}
			<Button
				variant="contained"
				onClick={handleAddMember}
				sx={{ width: "100%" }}>
				Add {teamType.charAt(0).toUpperCase() + teamType.slice(1, -1)}
			</Button>
		</Box>
	);
};

export default TeamForm;
