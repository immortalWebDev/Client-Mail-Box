import { createSlice } from "@reduxjs/toolkit";

const initialMailBoxState = {
  mails: [],
  isLoading: false,
};

const mailSlice = createSlice({
  name: "mail",
  initialState: initialMailBoxState,
  reducers: {
    addToInbox: (state, action) => {
      state.mails.push(...action.payload);
    },
    setRead: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.isRead = true;
    },
    setIsChecked: (state, action) => {
      const { id, selector } = action.payload;
      if (selector === "SINGLE") {
        const mailItem = state.mails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (selector === "NONE") {
        state.mails = state.mails.map((mail) => ({
          ...mail,
          isChecked: false,
        }));
      }
    },
  },
});

export const { addToInbox, setIsChecked, setRead } = mailSlice.actions;
export default mailSlice.reducer;
