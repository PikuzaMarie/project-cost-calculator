import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "./MainPageComponents/MainHeader";
import MainProjects from "./ProjectsPage";
import { Box, Button, Typography } from "@mui/material";

const HomePage = () => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		} else {
			const decodedToken = JSON.parse(atob(token.split(".")[1]));
			setUser(decodedToken);
		}
	}, [navigate]);

	const handleClick = () => {
		navigate("/home/projects");
	};

	return (
		<Box>
			<MainHeader />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "60px",
					gap: "20px",
				}}>
				<Typography
					variant="h4"
					component="h2">
					Welcome, dear user!
				</Typography>
				<Button
					variant="contained"
					onClick={handleClick}
					sx={{ width: "fit-content" }}>
					Go to Projects
				</Button>
			</Box>
			{/* {user ? (
				<div>
					<h2>Welcome, {user.email}</h2>
					<p>Role: {user.role}</p>
				</div>
			) : (
				<p>Loading...</p>
			)} */}
		</Box>
	);
};

export default HomePage;
