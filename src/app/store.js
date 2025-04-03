import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "../features/api/authApi"; // Ensure this path is correct
import { courseApi } from "@/features/api/courseApi";
import { lectureApi } from "@/features/api/lectureApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { examApi } from "@/features/api/examApi"; // ✅ Added Exam API

export const appStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [lectureApi.reducerPath]: lectureApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [examApi.reducerPath]: examApi.reducer, // ✅ Added Exam API Reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(courseApi.middleware)
      .concat(lectureApi.middleware)
      .concat(purchaseApi.middleware)
      .concat(examApi.middleware), // ✅ Added Exam API Middleware
});

// ✅ Load User Data on App Start
const initializeApp = async () => {
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();
