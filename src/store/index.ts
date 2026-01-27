import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth.slice"; 

const rootReducer = combineReducers({
  auth: authReducer,
  // add slices here
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // choose slices to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store); // <-- THIS FIXES THE ERROR

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
