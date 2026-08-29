// https://6a932d4125936d5660f09f8d.mockapi.io/api/user

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://6a932d4125936d5660f09f8d.mockapi.io/api/user/"; // MockAPI URL

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await axios.get(API_URL);
    const res = response.data;
    console.log(res);
    return res;
})

export const addUser = createAsyncThunk("users/addUser", async (newUserData) => {
    const response = await axios.post(API_URL, newUserData);
    return response.data;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
    const response = await axios.delete(`${API_URL}${userId}`);
    return response.data;
});

const dataSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            //add user
            .addCase(addUser.pending, (state) => {
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // delete user
            .addCase(deleteUser.pending, () => {
                
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default dataSlice.reducer;