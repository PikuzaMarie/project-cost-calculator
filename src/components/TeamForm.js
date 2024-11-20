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

	return (
		<Box sx={{ marginBottom: "20px" }}>
			<Typography
				variant="h6"
				sx={{ marginTop: "20px" }}>
				{teamType.charAt(0).toUpperCase() + teamType.slice(1)} Team
			</Typography>
			{team.map((member, index) => (
				<Box
					key={index}
					sx={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
					<TextField
						label={`${
							teamType.charAt(0).toUpperCase() + teamType.slice(1, -1)
						}`}
						value={member[teamType]}
						onChange={(e) => handleChange(index, teamType, e.target.value)}
						type="number"
						required
					/>
					<TextField
						label="Hourly Rate"
						value={member.hourlyRate}
						onChange={(e) => handleChange(index, "hourlyRate", e.target.value)}
						type="number"
						required
					/>
					<TextField
						label="Hours Worked"
						value={member.hoursWorked}
						onChange={(e) => handleChange(index, "hoursWorked", e.target.value)}
						type="number"
						required
					/>
				</Box>
			))}
			<Button
				variant="contained"
				onClick={handleAddMember}>
				Add {teamType.charAt(0).toUpperCase() + teamType.slice(1)}
			</Button>
		</Box>
	);
};

export default TeamForm;
