import React, { useState } from "react";
import { Box, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const MainHeader = () => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleAvatarClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		console.log("Logged out");
		setAnchorEl(null);
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				width: "100vw",
				height: "60px",
				padding: "0 32px 0",
				backgroundColor: "#01579b",
			}}>
			<MenuIcon
				size="large"
				sx={{ width: 32, height: 32, color: "white" }}
			/>
			<Box sx={{ display: "flex", gap: "32px", alignItems: "center" }}>
				<SearchIcon sx={{ width: 32, height: 32, color: "#ffffff" }} />

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
