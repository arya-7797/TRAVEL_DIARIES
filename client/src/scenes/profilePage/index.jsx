import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { setLogout } from "state";
import { baseUrl } from "utils/constants";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [activeTab, setActiveTab] = useState("posts");
  const getUser = async () => {
    try {
      const response = await fetch(`${baseUrl}users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('user data ',data)
      setUser(data);
    } catch (error) {
      dispatch(setLogout())
      console.log("pp pp  ", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user?.picturePath} />
          <Box m="2rem 0" />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <div className={`${activeTab === "friends" ? "mb-4" : ""}`}>
            <div
              onClick={() => setActiveTab("posts")}
              className={`btn ${
                activeTab === "posts" ? "btn-info " : "btn-outline-info"
              } mx-1`}
            >
              posts
            </div>
            <div
              onClick={() => setActiveTab("friends")}
              className={`btn mx-1 ${
                activeTab === "friends" ? "btn-info" : "btn-outline-info"
              }`}
            >
              Friends
            </div>
          </div>

          {activeTab === "posts" ? (
            <PostsWidget userId={userId} isProfile />
          ) : null}
          {activeTab === "friends" ? (
            <FriendListWidget userId={userId} />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
