import { apiSlice } from './apiSlice';

const USERS_URL = '';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `/user/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (user) => ({
        url: `/user/register`,
        method: 'POST',
        body: user,
      }),
    }),
    // logout: builder.mutation({})
  }),
});

export const { useLoginMutation, useSignupMutation } = usersApiSlice;
