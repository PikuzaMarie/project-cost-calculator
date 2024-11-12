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

const LoginPage = () => {
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
			}}>
			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={0}
				alignItems="stretch"
				sx={{ width: "100%" }}>
				<Box
					sx={{
						textAlign: "left",
						width: "50%",
						backgroundColor: "#ffffff",
						padding: 3,
						borderRadius: 2,
						boxShadow: 3,
					}}>
					<CalculateIcon
						fontSize="large"
						color="primary"
						sx={{
							marginBottom: "10px",
						}}
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							marginBottom: "40px",
						}}>
						<Typography
							variant="h4"
							color="#01579b"
							fontWeight="800"
							gutterBottom>
							CheckCost
						</Typography>
						<Typography
							variant="h6"
							gutterBottom
							sx={{
								letterSpacing: "0.5px",
								lineHeight: "130%",
							}}>
							Easy and fast calculation of software development cost using a
							destructuring method
						</Typography>
					</Box>

					<Typography
						variant="body1"
						gutterBottom>
						<b>Version 0.0.0 is available now! </b>
					</Typography>
					<ol
						style={{
							textAlign: "left",
							padding: "0 16px",
							margin: "8px 0 0",
						}}>
						<li>Create, update, delete a project </li>
						<li>Create a report using a simple form </li>
						<li>Export a report to show it to the client </li>
					</ol>
				</Box>

				<Box
					sx={{
						textAlign: "center",
						width: "50%",
						backgroundColor: "#e0e9fa",
						padding: 3,
						borderRadius: 2,
						boxShadow: 3,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "300px",
					}}>
					<Typography
						variant="h4"
						gutterBottom>
						Login
					</Typography>
					<form
						onSubmit={handleLogin}
						style={{ width: "80%" }}>
						<TextField
							label="Email"
							type="email"
							margin="normal"
							value={email}
							size="small"
							onChange={(e) => setEmail(e.target.value)}
							required
							sx={{
								backgroundColor: "#ffffff",
								width: "80%",
							}}
						/>
						<TextField
							label="Password"
							type="password"
							margin="normal"
							value={password}
							size="small"
							onChange={(e) => setPassword(e.target.value)}
							required
							sx={{
								backgroundColor: "#ffffff",
								width: "80%",
							}}
						/>
						<Button
							type="submit"
							variant="contained"
							sx={{
								mt: 2,
								backgroundColor: "#0288d1",
								color: "#ffffff",
								"&:hover": { backgroundColor: "#01579b" },
								width: "80%",
								marginLeft: "auto",
								marginRight: "auto",
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
