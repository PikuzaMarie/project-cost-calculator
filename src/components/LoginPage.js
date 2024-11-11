import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	TextField,
	Button,
	Typography,
	Container,
	Box,
	Alert,
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
			localStorage.setItem("token", response.data.token); // Сохраняем JWT в localStorage
			navigate("/home"); // Перенаправляем на домашнюю страницу
		} catch (err) {
			setError(err.response?.data?.message || "Something went wrong");
		}
	};

	return (
		<Container
			component="main"
			maxWidth="xs">
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					padding: 3,
				}}>
				<Typography
					variant="h4"
					gutterBottom>
					Login
				</Typography>

				<form
					onSubmit={handleLogin}
					style={{ width: "100%" }}>
					<TextField
						label="Email"
						type="email"
						fullWidth
						margin="normal"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<TextField
						label="Password"
						type="password"
						fullWidth
						margin="normal"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{ mt: 2 }}>
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
		</Container>
	);
};

export default LoginPage;
