import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import messageReducer from "./messageSlice.js";
import socketReducer from "./socketSlice.js";

const store = configureStore({
  reducer: {
    // Add your reducers here
    user: userReducer,
    message: messageReducer,
    socket: socketReducer,
  },
});
export default store;
