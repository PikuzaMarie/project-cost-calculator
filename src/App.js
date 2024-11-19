import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import ProjectsPage from "./components/ProjectsPage";
import EditProject from "./components/EditProject";
import CreateReportForm from "./components/CreateReportForm";
import ReportDetails from "./components/ReportDetails";

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
					path="/home/projects/:projectId/report"
					element={<CreateReportForm />}
				/>
				<Route
					path="/home/projects/:projectId/report/:reportId"
					element={<ReportDetails />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
