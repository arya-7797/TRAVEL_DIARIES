import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import React, { lazy, Suspense } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import EditPost from "./EditPost";
import Modal from "@mui/material/Modal";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import axios from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Swal from "sweetalert2";
import { baseUrl } from "../../utils/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const LazyPostWidget = lazy(() => import("./PostWidget"));

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  comments,
  likes,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const [postDescription, setPostDescription] = useState(description);
  const [postPicturePath, setPicturePath] = useState(picturePath);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [editToggle, setEditToggle] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const notifyReportSuccess = () => toast.success("The post is reported");
  const notifyReportExists = () => toast.warn("You have already reported!");
  const notifyReportFailure = () => toast.error("Something Went wrong");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const updatePost = (image, postDescription) => {
    if (image) setPicturePath(image);
    setPostDescription(postDescription);
    setEditToggle(false);
  };

  const patchLike = async () => {
    const response = await fetch(`${baseUrl}posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleReport = async (optionText) => {
    try {
      await axios
        .post(
          `posts/report/${postId}`,
          { userId: loggedInUserId, reportReason: optionText },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            notifyReportSuccess();
          }
        })
        .catch((error) => {
          if (error.response.status === 304) notifyReportExists();
          else notifyReportFailure();
        });
    } catch (error) {}
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleDeletePost = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${baseUrl}posts/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId, userId: loggedInUserId }),
          });
          const deletedPost = await response.json();
          setIsDeleted(true);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  if (isDeleted) {
    return null;
  }

  const handleAddComment = async () => {
    try {
      if (newComment.trim() === "") {
        return;
      }
      const response = await axios.post(
        `posts/${postId}/comment`,
        { comment: newComment, userId: loggedInUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedPost = response.data;
      setIsComments(updatedPost.comments);
      setNewComment("");
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsComments(response?.data?.post?.comments);
      dispatch(setPost({ post: response?.data?.post }));
    } catch (error) {
      console.log("error t", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />

        <Typography color={main} sx={{ mt: "1rem" }}>
          {postDescription}
        </Typography>
        {picturePath && (
          <LazyLoadImage
            effect="blur"
            className="m-2"
            src={`${baseUrl}assets/${postPicturePath}`}
            alt=""
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            width="100%"
            height="300px"
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          {loggedInUserId === postUserId ? (
            <div>
              <IconButton onClick={() => setEditToggle(!editToggle)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeletePost}>
                <DeleteOutlined />
              </IconButton>
            </div>
          ) : (
            <>
              <IconButton>
                <FlagIcon onClick={handleOpen} />
              </IconButton>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Report the post
                  </Typography>
                  <ListItemButton
                    onClick={() => handleReport("Irrelevant Topic")}
                    component="a"
                    href="#simple-list"
                  >
                    <ListItemText primary="Irrelevant Topic" />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleReport("Scam or fraud")}
                    component="a"
                    href="#simple-list"
                  >
                    <ListItemText primary="Scam or fraud" />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleReport("Hate speech or symbol")}
                    component="a"
                    href="#simple-list"
                  >
                    <ListItemText primary="Hate speech or symbol" />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleReport("False Information")}
                    component="a"
                    href="#simple-list"
                  >
                    <ListItemText primary="False Information" />
                  </ListItemButton>
                </Box>
              </Modal>
            </>
          )}
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            <div
              className="d-flex justify-content-between align-self-center   "
              style={{
                maxHeight: "60px",
              }}
            >
              <input
                type=" "
                className=" "
                placeholder="Add Comment"
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                style={{
                  width: "80%",
                  borderRadius: "18px",
                  paddingLeft: "5px",
                }}
              />
              <button className="btn btn-info" onClick={handleAddComment}>
                send
              </button>
            </div>
            {comments.map((comment, i) => (
              <div className="d-flex justify-content-between  my-3">
                <div className="d-flex">
                  <img
                    src={`${baseUrl}assets/${comment?.author?.picturePath}`}
                    alt=""
                    height={"40"}
                    width={"50"}
                    style={{ borderRadius: "50%" }}
                  />
                  <div className="mx-3">
                    <span className="d-block">
                      {comment?.author?.firstName}
                    </span>
                    <span className="d-block">{comment?.comment}</span>
                  </div>
                  <div></div>
                </div>

                <IconButton onClick={() => handleDeleteComment(comment?._id)}>
                  <DeleteOutlined />
                </IconButton>
              </div>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
      {editToggle && (
        <EditPost
          postId={postId}
          postUserId={postUserId}
          name={name}
          description={description}
          location={location}
          picturePath={picturePath}
          userPicturePath={userPicturePath}
          updatePost={updatePost}
        />
      )}
    </>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyPostWidget
        postId={postId}
        postUserId={postUserId}
        name={name}
        description={description}
        location={location}
        picturePath={picturePath}
        userPicturePath={userPicturePath}
        comments={comments}
        likes={likes}
      />
    </Suspense>
  );
};

export default PostWidget;
