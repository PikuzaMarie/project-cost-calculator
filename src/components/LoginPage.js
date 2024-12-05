import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import {
	TextField,
	Button,
	Typography,
	Container,
	Box,
	Alert,
	Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LoginPage = () => {
	const theme = useTheme();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post("http://localhost:5000/login", {
				email,
				password,
			});
			localStorage.setItem("token", response.data.token);
			navigate("/home");
		} catch (err) {
			setError(err.response?.data?.message || "Something went wrong");
		}
	};

	return (
		<Container
			component="main"
			maxWidth="lg"
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: theme.palette.white.main,
			}}>
			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={0}
				alignItems="stretch"
				sx={{ width: "80%" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "30px",
						textAlign: "left",
						width: "50%",
						backgroundColor: "white",
						padding: 3,
					}}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "400px",
						}}>
						<CalculateIcon
							fontSize="large"
							sx={{
								margin: "0 0 10px 0",
								color: theme.palette.primary.main,
							}}
						/>
						<Typography
							variant="h4"
							fontWeight="800"
							gutterBottom
							sx={{ color: "black" }}>
							CheckCost
						</Typography>
						<Typography
							variant="h6"
							sx={{
								letterSpacing: "0.5px",
								lineHeight: "130%",
								color: theme.palette.custom.dark_gray,
							}}>
							Easy and fast calculation of software development cost
						</Typography>
					</Box>
					<Box
						sx={{
							color: theme.palette.custom.gray,
						}}>
						<Typography variant="body1">
							<b>Version 0.0.0 is available now! </b>
						</Typography>
						<ol
							style={{
								textAlign: "left",
								padding: "0 16px",
								margin: "8px 0 0",
							}}>
							<li>Create, update, delete a project and view its details</li>
							<li>Create a report using a simple form</li>
							<li>View report details for each project if it has any</li>
						</ol>
					</Box>
				</Box>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "300px",
						textAlign: "center",
						width: "50%",
						padding: 3,
						backgroundColor: theme.palette.background.main,
						color: "black",
						borderRadius: 2,
					}}>
					<Typography
						variant="h4"
						gutterBottom
						fontWeight="600">
						Login
					</Typography>
					<form onSubmit={handleLogin}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								gap: "8px",
								marginBottom: "16px",
							}}>
							<TextField
								label="Email"
								type="email"
								value={email}
								size="small"
								onChange={(e) => setEmail(e.target.value)}
								required
								sx={{
									backgroundColor: theme.palette.white.main,
									width: "100%",
								}}
							/>
							<TextField
								label="Password"
								type="password"
								value={password}
								size="small"
								onChange={(e) => setPassword(e.target.value)}
								required
								sx={{
									backgroundColor: theme.palette.white.main,
									width: "100%",
								}}
							/>
						</Box>

						<Button
							type="submit"
							variant="contained"
							sx={{
								marginLeft: "auto",
								marginRight: "auto",
								width: "100%",
							}}>
							Login
						</Button>
					</form>
					{error && (
						<Alert
							severity="error"
							sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}
				</Box>
			</Stack>
		</Container>
	);
};

export default LoginPage;
