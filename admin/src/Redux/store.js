import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  admin: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.admin = null;
      state.token = null;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setUser: (state, action) => {
      state.admin = action.payload.admin;
    },
    setReports: (state, action) => {
      state.reports = action.payload.reports;
    },

    setMessages: (state, action) => {
      state.messages = action.payload.messages;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload.allUsers;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setToken,
  setLogout,
  setMove,
  setPost,
  setUser,
  setPosts,
  setAllUsers,
  setReports,
  setMessages,
} = authSlice.actions;
export default authSlice.reducer;
