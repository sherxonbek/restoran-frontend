import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/userSlice";
import roomSlice from "./Slice/roomSlice";
import productSlice from "./Slice/productSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    rooms: roomSlice,
    products: productSlice,
  },
});

export default store;