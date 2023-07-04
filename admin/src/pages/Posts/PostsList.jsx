import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PostSingleCard from "../../components/PostSingleCard/PostSingleCard";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import axios from "../../utils/axios";
import TablePagination from "@mui/material/TablePagination";
import { setPosts } from "../../Redux/store";
import { baseUrl } from "../../utils/Constants";

function PostsList() {
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const getAllPosts = async () => {
    axios
      .get("/posts/posts", {
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
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedPosts = posts?.filter((post) => !post.isDelete);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, displayedPosts?.length - page * rowsPerPage);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="postMain p-5">
          <span className="fs-1 text-secondary">POSTS</span>
          <TableContainer component={Paper} className="table shadow p-3">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">NO</TableCell>
                  <TableCell className="tableCell">USERNAME</TableCell>
                  <TableCell className="tableCell">IMAGE</TableCell>
                  <TableCell className="tableCell">DESCRIPTION</TableCell>
                  <TableCell className="tableCell">ACTION</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {displayedPosts
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((post, i) => (
                    <PostSingleCard key={i} post={post} index={i} />
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayedPosts?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default PostsList;
