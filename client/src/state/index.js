import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.posts = [];
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
  },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :()");
      }
    },
    setGroups: (state, action) => {
      state.groups = action.payload.groups;
    },

    addGroup: (state, action) => {
      state.groups.unshift(action.payload.newGroup);
    },
    pushMessages: (state, action) => {
      const message = action.payload.newMessage;
      state.groups = state.groups.map((group) =>
        group._id === message.selectedCommunity
          ? {
            ...group,
            messages: [...group.messages, message],
          }
          : group
      );
    },


    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    
    setComments:(state,action)=>{
      state.comment = action.payload.posts;
    },
    
  },
});

export const { setMode, setLogin, setLogout, setUser, setFriends,pushMessages,addGroup,setGroups, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
