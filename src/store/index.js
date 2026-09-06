import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import roomSlice from "./slices/roomSlice";
import productSlice from "./slices/productSlice";
import orderSlice from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    rooms: roomSlice,
    products: productSlice,
    orders: orderSlice,
  },
});

export default store;