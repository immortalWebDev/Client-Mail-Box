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

    setIsChecked: (state, action) => {
      const { id, selector } = action.payload;

      if (selector === "single") {
        const mailItem = state.mails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (selector === "all") {
        const checked = state.mails.some((item) => item.isChecked === false);
        console.log(checked);
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: checked ? true : false,
          };
        });
      } else if (selector === "allMark" || selector === "none") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: selector === "allMark",
          };
        });
      } else if (selector === "read" || selector === "unread") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.isRead === (selector === "read"),
          };
        });
      } else if (selector === "starred" || selector === "unstarred") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: mail.starred === (selector === "starred"),
          };
        });
      }
    },
    moveFromInbox: (state, action) => {
      const { move, email } = action.payload;
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked && mail.recipient === email) {
          if (move === "toTrash") {
            return {
              ...mail,
              isTrashed: true,
            };
          } else if (move === "toInbox") {
            return {
              ...mail,
              isTrashed: false,
            };
          }
        }
        return mail;
      });
    },

    
    
    setRead: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.isRead = true;
    },
    

   
    emptyTrash: (state) => {
      state.mails = state.mails.filter((mail) => mail.isTrashed === false);
    },
  },
});

export const {
  addToInbox,
  setIsChecked,
  moveFromInbox,
  moveFromSentbox,
  setRead,
 
 
 
 
 
  emptyTrash,
 
} = mailSlice.actions;
export default mailSlice.reducer;
