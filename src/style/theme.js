import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#3f51b5",
		},
		secondary: {
			light: "#4db6ac",
			main: "#00897b",
			dark: "#004d40",
			contrastText: "#004d40",
		},
		white: { main: "#ffffff" },
		black: { main: "#000000" },
		error: { main: "#f44336" },
		warning: { main: "#ff9800" },
		info: { main: "#673ab7" },
		success: { main: "#4caf50" },
		custom: {
			dark_gray: "#212121",
			gray: "#616161",
			light_gray: "#eeeeee",
		},
		background: {
			main: "#e8eaf6",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "6px",
					width: "fit-content",
					color: "#ffffff",
				},
				contained: {
					backgroundColor: "#303f9f",
					"&:hover": { backgroundColor: "#1a237e" },
				},
				containedSecondary: {
					backgroundColor: "#009688",

					"&:hover": { backgroundColor: "#00695c" },
				},
				outlined: {
					backgroundColor: "transparent",
					color: "#009688",
					border: " 1px solid #009688",
					"&:hover": { backgroundColor: "#e1f5fe" },
				},
				outlinedError: {
					backgroundColor: "transparent",
					color: "#f44336",
					border: " 1px solid #f44336",

					"&:hover": { backgroundColor: "#ffebee" },
				},
			},
		},
		MuiTextField: {
			styleOverrides: { root: { "&.MuiTextField-form": { width: "100%" } } },
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: "#00897b",
					backgroundColor: "transparent",
					"&:hover": { backgroundColor: "#e0f2f1" },
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: { root: { width: 32, height: 32 } },
		},
	},
});

export default theme;
