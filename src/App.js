import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import ProjectsPage from "./components/ProjectsPage";
import EditProject from "./components/EditProject";
import CostReportPage from "./components/ConstReportPage";
import ReportPage from "./components/ReportPage";

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
				<Route
					path="/home/projects/:projectId"
					element={<EditProject />}
				/>
				<Route
					path="/newreport/:projectId"
					element={<CostReportPage />}
				/>
				<Route
					path="/home/projects/:projectId/report/:reportId"
					element={<ReportPage />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
