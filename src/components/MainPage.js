import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployee } from "../store/employeeSlice";

const HomePage = () => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const employee = useSelector((state) => state.employee.data);
	const employeeStatus = useSelector((state) => state.employee.status);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		} else {
			const decodedToken = JSON.parse(atob(token.split(".")[1]));
			setUser(decodedToken);
			dispatch(fetchEmployee());
		}
	}, [navigate, dispatch]);

	const handleClick = () => {
		navigate("/home/projects");
	};

	if (employeeStatus === "loading") {
		return <Typography>Loading...</Typography>;
	}

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
					{employee && employee.name
						? `Welcome, dear ${employee.name}!`
						: "Welcome, dear employee!"}
				</Typography>
				<Button
					variant="contained"
					onClick={handleClick}
					sx={{ width: "fit-content" }}>
					Go to Projects
				</Button>
			</Box>
		</Box>
	);
};

export default HomePage;
