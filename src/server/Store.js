import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/userSlice";
import roomSlice from "./Slice/roomSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    rooms: roomSlice,
  },
});

export default store;