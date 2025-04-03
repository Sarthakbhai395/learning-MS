// Import the React-specific entry point to use createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { userLoggedIn } from './authSlice'; // Ensure this is correctly imported
import { userLoggedIn, userLoggedOut } from '../authSlice';

const userApi = "http://localhost:3000/api/v1/user/";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: userApi, credentials: 'include' }), // Use 'include' for credentials

  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (formData) => ({
        url: "register",
        method: "POST",
        body: formData,
      }),
    }),
  
    loginUser: builder.mutation({
      query: (formData) => ({
        url: "login",
        method: "POST", // POST is more appropriate for sending form data
        body: formData,
      }),
    
    async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (err) {
          console.error("Error during login:", err);
        }
      },

    }),

    logoutUser: builder.mutation({
      query: () => ({
        url:"logout",
        method: "POST",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (err) {
          console.error("Error during login:", err);
        }
      },

    }),

    loadUser : builder.query({
      query: ()=>({
        url:"/profile",
        method:"GET",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (err) {
          console.error("Error during login:", err);
        }
      },

    }),

    updateUser : builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body:formData,
      }),

    })

    

  }),
});

// Export hooks for usage in functional components
export const { useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery,useUpdateUserMutation,useLogoutUserMutation} = authApi;
