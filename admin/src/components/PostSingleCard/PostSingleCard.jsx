import React from "react";
import Swal from "sweetalert2";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../../Redux/store";
import { baseUrl } from "../../utils/Constants";

function PostSingleCard({ post, index }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const getAllPosts = () => {
    try {

      axios
        .get("posts/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          dispatch(setPosts({ posts: response.data }));
        })
        .catch((error) => {
          console.log("inside catch");
          console.log(error);
        });
            
    } catch (error) {
      
    }
  };

  const deletePost = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${baseUrl}posts/${post._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ admin: true }),
            }
          );

          getAllPosts();

          if (response.status === 200) {
            Swal.fire("Deleted", "The Post is deleted", "success");
            window.location.reload();
          } else {
            Swal.fire("Failed", "Failed to delete the post", "error");
          }
        } catch (error) {
          console.log("blockUser error => ", error);
        }
      }
    });
  };

  return (
    <>
      <TableRow key={index + 1}>
        <TableCell className="tableCell">{index + 1}</TableCell>
        <TableCell className="tableCell">
          {post.firstName} {post.lastName}
        </TableCell>
        <TableCell className="tableCell">
          <img
            height={50}
            width={50}
            src={`${baseUrl}assets/${post.picturePath}`}
            alt="se"
          />
        </TableCell>
        <TableCell className="tableCell">
          {post.description.slice(0, 40)}...
        </TableCell>

        <TableCell align="left">
          {
            <Button
              className="btn btn-outline-danger"
              onClick={deletePost}
              variant="outlined"
              color="error"
            >
              DELETE
            </Button>
          }
        </TableCell>
      </TableRow>
    </>
  );
}

export default PostSingleCard;
