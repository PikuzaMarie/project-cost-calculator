import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import ProjectsPage from "./components/ProjectsPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<LoginPage />}
				/>
				<Route
					path="/home"
					element={<MainPage />}
				/>
				<Route
					path="/home/projects"
					element={<ProjectsPage />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
