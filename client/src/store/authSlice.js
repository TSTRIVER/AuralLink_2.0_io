import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuth: false,
  otp: {
    phone: "",
    hash: "",
    flag: "",
    email: "",
  },
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      if (user == null) {
        state.isAuth = false;
      } else {
        state.isAuth = true;
      }
    },
    setOTP: (state, action) => {
      const { phone, hash, email, flag } = action.payload;
      if (flag === "phone") {
        state.otp.phone = phone;
        state.otp.hash = hash;
        state.otp.flag = flag;
      } else {
        state.otp.email = email;
        state.otp.hash = hash;
        state.otp.flag = flag;
      }
    },
  },
});

export const { setAuth, setOTP } = authSlice.actions;

export default authSlice.reducer;
