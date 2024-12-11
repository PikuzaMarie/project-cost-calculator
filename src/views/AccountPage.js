import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployee } from "../store/slices/employeeSlice";
import { useTheme } from "@mui/material/styles";
import {
	Box,
	Button,
	TextField,
	Typography,
	Breadcrumbs,
	Link,
	IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainHeader from "../components/MainHeader";
import { jwtDecode } from "jwt-decode";

const AccountPage = () => {
	const theme = useTheme();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { employee, status, error } = useSelector((state) => state.employee);
	const { projects } = useSelector((state) => state.projects);
	const { reports } = useSelector((state) => state.reports);

	const [isEditing, setIsEditing] = useState(false);

	const [name, setName] = useState(employee ? employee.name : "");
	const [position, setPosition] = useState(employee ? employee.position : "");
	const [department, setDepartment] = useState(
		employee ? employee.department : ""
	);

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
			}
		}
	}, [navigate]);

	useEffect(() => {
		if (employee) {
			setName(employee.name);
			setPosition(employee.position);
			setDepartment(employee.department);
		}
	}, [employee]);

	const handleSave = () => {
		const updatedEmployee = {
			...employee,
			name: name || employee.name,
			position: position || employee.position,
			department: department || employee.department,
		};

		if (
			updatedEmployee.name !== employee.name ||
			updatedEmployee.position !== employee.position ||
			updatedEmployee.department !== employee.department
		) {
			console.log(updatedEmployee);
			dispatch(updateEmployee(updatedEmployee));
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		setName(employee?.name || "");
		setPosition(employee?.position || "");
		setDepartment(employee?.department || "");
		setIsEditing(false);
	};

	if (status === "loading") return <Typography>Loading...</Typography>;

	return (
		<Box>
			<MainHeader />
			<Box sx={{ padding: "24px 32px" }}>
				<Breadcrumbs aria-label="breadcrumb">
					<Link
						underline="hover"
						color="inherit"
						href="/home">
						Main
					</Link>
					<Typography sx={{ color: theme.palette.black.main }}>
						Account
					</Typography>
				</Breadcrumbs>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: "10px",
						marginTop: "40px",
					}}>
					<IconButton
						onClick={() => navigate(`/home`)}
						edge="start"
						aria-label="back">
						<ArrowBackIcon />
					</IconButton>
					<Typography
						variant="h4"
						component="h3"
						fontWeight="500">
						{isEditing
							? "Manage account information"
							: "View account information"}
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					gap: "32px",
					padding: "0 32px",
					width: "100vw",
				}}>
				{error && (
					<Typography
						variant="body2"
						color="error">
						{error}
					</Typography>
				)}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "24px",
						padding: "0 32px",
						width: "50vw",
					}}>
					{isEditing ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}>
							<TextField
								name="name"
								label="Full name"
								variant="outlined"
								sx={{ width: "100%" }}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<TextField
								name="position"
								label="Position"
								variant="outlined"
								sx={{ width: "100%" }}
								value={position}
								onChange={(e) => setPosition(e.target.value)}
							/>
							<TextField
								name="department"
								label="Department"
								variant="outlined"
								sx={{ width: "100%" }}
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
							/>
						</Box>
					) : (
						<Box>
							<Typography
								variant="body1"
								sx={{ color: theme.palette.black.main }}>
								<strong>Name:</strong> {employee.name}
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: theme.palette.black.main }}>
								<strong>Position:</strong> {employee.position}
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: theme.palette.black.main }}>
								<strong>Department:</strong> {employee.department}
							</Typography>
						</Box>
					)}

					{isEditing ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}>
							<TextField
								name="email"
								label="Email"
								variant="outlined"
								type="email"
								sx={{ width: "100%" }}
								value="winterday@gmail.com"
								// onChange={(e) =>
								// 	setEmail(e.target.value)
								// }
							/>
							<TextField
								name="password"
								label="Password"
								variant="outlined"
								type="password"
								sx={{ width: "100%" }}
								value="123"
								// onChange={(e) =>
								// 	setPassword(e.target.value)
								// }
							/>
						</Box>
					) : (
						<Box>
							<Typography
								variant="body1"
								sx={{ color: theme.palette.black.main }}>
								<strong>Email:</strong> winterday@gmail.com
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: theme.palette.black.main }}>
								<strong>Password:</strong> ***
							</Typography>
						</Box>
					)}
					{isEditing ? (
						<Box sx={{ marginTop: "20px", display: "flex", gap: "20px" }}>
							<Button
								variant="contained"
								size="normal"
								onClick={handleSave}
								color="success">
								Save Changes
							</Button>
							<Button
								variant="outlined"
								size="normal"
								onClick={handleCancel}>
								Cancel
							</Button>
						</Box>
					) : (
						<Button
							variant="outlined"
							size="normal"
							onClick={() => setIsEditing(true)}>
							Edit
						</Button>
					)}
				</Box>
				<Box>
					<Typography
						variant="h6"
						mb={2}>
						Stats for {employee.name}
					</Typography>
					<Box
						sx={{
							display: "flex",
							gap: "24px",
						}}>
						<Box>
							<Typography variant="subtitle1">
								<strong>Projects count:</strong> {projects.length}
							</Typography>
							<Typography variant="body1">
								- active:{" "}
								{
									projects.filter(
										(project) => project.project_status === "active"
									).length
								}
							</Typography>
							<Typography variant="body1">
								- inactive:{" "}
								{
									projects.filter(
										(project) => project.project_status === "inactive"
									).length
								}
							</Typography>
						</Box>
						<Box>
							<Typography variant="subtitle1">
								<strong>Reports count:</strong> {reports.length}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default AccountPage;
