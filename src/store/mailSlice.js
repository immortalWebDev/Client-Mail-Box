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
        console.log(mailItem);

        if (mailItem) {
        mailItem.isChecked = !mailItem.isChecked;
        }
      } else if (selector === "MAIN-ALL") {
        const checked = state.mails.some((item) => item.isChecked === false);
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: checked ? true : false,
          };
        });
      } else if (selector === "DROPDOWN-ALL") {
        state.mails = state.mails.map((mail) => ({
          ...mail,
          isChecked: true,
        }));
      } else if (selector === "none") {
        state.mails = state.mails.map((mail) => ({
          ...mail,
          isChecked: false,
        }));
      } else if (selector === "read") {
        state.mails = state.mails.map((mail) => ({
          ...mail,
          isChecked: mail.isRead === true,
        }));
      } else if (selector === "unread") {
        state.mails = state.mails.map((mail) => ({
            ...mail,
          isChecked: mail.isRead === false,
        }));
      } else if (selector === "starred") {
        state.mails = state.mails.map((mail) => ({
            ...mail,
          isChecked: mail.starred === true,
        }));
      } else if (selector === "UNSTARRED") {
        state.mails = state.mails.map((mail) => ({
            ...mail,
          isChecked: mail.starred === false,
        }));
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

    moveFromSent: (state, action) => {
      const { move, email } = action.payload;
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked && mail.sender === email) {
          return {
            ...mail,
            isTrashed: move === "toTrash",
          };
        }
        return mail;
      });
    },
    moveFromStarred: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.isChecked && mail.starred === true) {
          return {
            ...mail,
            isTrashed: action.payload === "toTrash",
          };
        }
        return mail;
      });
    },
    moveToTrash: (state, action) => {
      state.mails = state.mails.map((mail) => {
        if (mail.id === action.payload) {
          return {
            ...mail,
            isTrashed: true,
          };
        }
        return mail;
      });
    },
    setRead: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.isRead = true;
    },
    toggleStarred: (state, action) => {
      const { id } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.starred = !mailItem.starred;
    },
    clearInbox: (state) => {
      state.mails = [];
    },
    setMailsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    deleteForever: (state, action) => {
      const { id } = action.payload;
      state.mails = state.mails.filter((mail) => mail.id !== id);
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
  moveFromSent,
  setRead,
  clearInbox,
  setMailsLoading,
  moveToTrash,
  toggleStarred,
  deleteForever,
  emptyTrash,
  moveFromStarred,
} = mailSlice.actions;
export default mailSlice.reducer;
