import React from "react";
import Swal from "sweetalert2";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { setPosts } from "../../Redux/store";
import { baseUrl } from "../../utils/Constants";

function PostSingleCard({ report, index, getAllReports }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const unlistPost = (postId) => {
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
          const response = await axios.patch(`admin/post/${postId}`, {
            adminRequest: true,
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          getAllReports();
          if (response.status === 200) {
            Swal.fire("Unlisted", "The Post has been Unlisted", "success");
          } else {
            Swal.fire("Failed", "Failed to Unlist the post", "error");
          }
        } catch (error) {}
      }
    });
  };
  return (
    <>
      <TableRow key={index + 1}>
        <TableCell className="tableCell">{index + 1}</TableCell>
        <TableCell className="tableCell">
          <img
            height={50}
            width={50}
            src={`${baseUrl}assets/${report?.post?.picturePath}`}
            alt=" "
          />
        </TableCell>
        <TableCell className="tableCell">
          {report.post.description.slice(0, 20)}..
        </TableCell>
        <TableCell className="tableCell">{report.count}</TableCell>
        <TableCell className="tableCell">
          {report.reportedByUsers.map((User, i) =>
            i === report.reportedByUsers.length - 1
              ? "@" + User.firstName
              : "@" + User.firstName + " | "
          )}
        </TableCell>
        <TableCell className="tableCell">
          {report.reasons.map((reason, i) =>
            i === report.reasons.length - 1 ? reason : reason + " | "
          )}
        </TableCell>

        <TableCell align="left">
          {!report?.post?.unlisted ? (
            <button
              onClick={() => unlistPost(report?._id)}
              className="btn btn-outline-danger"
            >
              Unlist Post
            </button>
          ) : (
            <button className="btn btn-danger disabled">UNLISTED</button>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default PostSingleCard;
