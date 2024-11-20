import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/employeeSlice";
import {
	Box,
	Avatar,
	Menu,
	MenuItem,
	IconButton,
	TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const MainHeader = ({ onSearch }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [anchorEl, setAnchorEl] = useState(null);
	const [searchInputValue, setSearchInputValue] = useState("");
	const [showSearchInput, setShowSearchInput] = useState(false);

	const handleAvatarClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logout());
		console.log("Logged out");
		setAnchorEl(null);
		navigate("/");
	};

	const handleSearchClick = () => {
		setShowSearchInput(!showSearchInput);
		console.log(showSearchInput);
	};

	const handleSearchChange = (e) => {
		setSearchInputValue(e.target.value);
		onSearch(e.target.value);
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				width: "100vw",
				height: "68px",
				padding: "0 32px 0",
				backgroundColor: "#01579b",
			}}>
			<MenuIcon
				size="large"
				sx={{ width: 32, height: 32, color: "white" }}
			/>
			<Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
				{showSearchInput && (
					<TextField
						variant="outlined"
						size="small"
						value={searchInputValue}
						onChange={handleSearchChange}
						sx={{
							backgroundColor: "white",
							borderRadius: "4px",
							width: "200px",
						}}
						placeholder="Search by client"
					/>
				)}

				<IconButton onClick={handleSearchClick}>
					<SearchIcon sx={{ width: 32, height: 32, color: "#ffffff" }} />
				</IconButton>

				<IconButton onClick={handleAvatarClick}>
					<Avatar sx={{ width: 32, height: 32, bgcolor: "#ffffff" }}>
						<PersonIcon sx={{ color: "#01579b" }} />
					</Avatar>
				</IconButton>

				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleClose}>
					<MenuItem onClick={handleClose}>Manage Information</MenuItem>
					<MenuItem onClick={handleLogout}>
						<ExitToAppIcon sx={{ marginRight: 1 }} />
						Log out
					</MenuItem>
				</Menu>
			</Box>
		</Box>
	);
};

export default MainHeader;
