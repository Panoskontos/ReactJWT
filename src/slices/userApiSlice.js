import { apiSlice } from "./apiSlice";


const USERS_URL = '';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        login: builder.mutation({
            query: (data)=>({
                url:`/login`,
                method:'POST',
                body:data
            })
        }),
        logout: builder.mutation({})
    })
})

export const {useLoginMutation } = usersApiSlice;