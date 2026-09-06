import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { collection, getDoc } from "firebase/firestore";



export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
    const response = await getDoc(collection(db, "orders"));
    return response.data;
});

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {
        setOrdersRealTime: (state, action) => {
            state.orders = action.payload;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setOrdersRealTime } = orderSlice.actions;

export default orderSlice.reducer;