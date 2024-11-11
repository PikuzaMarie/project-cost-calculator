// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

	return (
		<div>
			{user ? (
				<div>
					<h2>Welcome, {user.email}</h2>
					<p>Role: {user.role}</p>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default HomePage;
