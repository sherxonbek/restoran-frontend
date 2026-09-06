import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/userSlice";
import roomSlice from "./Slice/roomSlice";
import productSlice from "./Slice/productSlice";
import orderSlice from "./Slice/roomSlice"; 

const store = configureStore({
  reducer: {
    users: userSlice,
    rooms: roomSlice,
    products: productSlice,
    orders: orderSlice,
  },
});

export default store;