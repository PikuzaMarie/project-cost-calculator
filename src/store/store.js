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

const persistConfig = {
	key: "root",
	storage,
};

const persistedProjectsReducer = persistReducer(persistConfig, projectsReducer);
const persistedReportsReducer = persistReducer(persistConfig, reportsReducer);

const store = configureStore({
	reducer: {
		projects: persistedProjectsReducer,
		reports: persistedReportsReducer,
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
