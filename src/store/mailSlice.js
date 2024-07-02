import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
  isLoading: false,
};

const mailSlice = createSlice({
  name: "mail",
  initialState: initialState,
  reducers: {
    addToInbox: (state, action) => {
      state.mails.push(...action.payload);
    },
  },
});

export const { addToInbox } = mailSlice.actions;
export default mailSlice.reducer;
