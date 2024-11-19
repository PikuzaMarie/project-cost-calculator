import { configureStore } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import projectsReducer from "./projectsSlice";
import reportsReducer from "./reportsSlice";
import employeeReducer from "./employeeSlice";

const persistConfig = {
	key: "root",
	storage,
};

const employeePersistConfig = {
	key: "employee",
	storage,
};

const persistedProjectsReducer = persistReducer(persistConfig, projectsReducer);
const persistedReportsReducer = persistReducer(persistConfig, reportsReducer);
const persistedEmployeeReducer = persistReducer(
	employeePersistConfig,
	employeeReducer
);

const store = configureStore({
	reducer: {
		projects: persistedProjectsReducer,
		reports: persistedReportsReducer,
		employee: persistedEmployeeReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);
export default store;
