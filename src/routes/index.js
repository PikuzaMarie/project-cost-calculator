import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../views/LoginPage";
import MainPage from "../views/HomePage";
import ProjectsPage from "../views/ProjectsPage";
import EditProject from "../views/ProjectPage";
import CreateReportForm from "../components/CreateReportForm";
import ReportDetails from "../views/ReportPage";
import AccountPage from "../views/AccountPage";

const AppRoutes = () => {
	return (
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
			<Route
				path="/home/account"
				element={<AccountPage />}
			/>
		</Routes>
	);
};

export default AppRoutes;
