import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployee } from "../store/slices/employeeSlice";
import { useTheme } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { employee, status, error } = useSelector((state) => state.employee);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/");
		} else {
			const decodedToken = jwtDecode(token);
			const currentTime = Date.now() / 1000;

			if (decodedToken.exp < currentTime) {
				localStorage.removeItem("token");
				navigate("/");
			} else {
				dispatch(fetchEmployee());
			}
		}
	}, [navigate, dispatch]);

	const handleClick = () => {
		navigate("/home/projects");
	};

	return (
		<Box>
			<MainHeader />
			{status === "loading" && <Typography>Loading...</Typography>}
			{error && <Typography>Oops... {error}</Typography>}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "120px",
					gap: "20px",
				}}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: "5px",
					}}>
					<Typography
						variant="h4"
						component="h2"
						fontWeight="600">
						{employee && employee.name
							? `Welcome, dear ${employee.name}!`
							: "Welcome, dear employee!"}
					</Typography>
					<Typography
						variant="h6"
						component="p">
						{employee && employee.position && employee.department
							? `Your position is ${employee.position} in ${employee.department}`
							: "Couldn't load information about you "}
					</Typography>
				</Box>
				<Typography
					variant="body1"
					component="p"
					sx={{
						color: theme.palette.custom.gray,
					}}>
					You can either manage your profile information or go straight to
					projects and do your magic!
				</Typography>
				<Button
					variant="contained"
					onClick={handleClick}
					sx={{
						marginLeft: "auto",
						marginRight: "auto",
					}}>
					Go to Projects
				</Button>
			</Box>
		</Box>
	);
};

export default HomePage;
