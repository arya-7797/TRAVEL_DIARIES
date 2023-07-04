import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { blockusers, getAllUsers, unblockusers } from "../../utils/Constants";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

const List = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect((key) => {
    getUsersList();
  }, []);

  const getUsersList = () => {
    axios
      .get(getAllUsers)
      .then((response) => {
        setUsers(response.data.user);
      })
      .catch((error) => {
        console.log("inside catch");
        console.log(error);
      });
  };

  const dispatch = useDispatch();
  const [state, setState] = useState([]);
  const [block, setBlock] = useState(false);
  useEffect(() => {
    axios.get(getAllUsers).then((response) => {
      setState(response.data);
    });
  }, [block]);

  const blockStaff = (id, successCallback) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will block the user account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, block it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`${blockusers}/${id}`)
          .then(({ data }) => {
            setBlock(!block);
            successCallback();
          })
          .catch((error) => {
            console.log(error);
          });

        Swal.fire("Blocked!", "The user account has been blocked.", "success");
      }
    });
  };

  const unblockStaff = (id) => {
    axios
      .patch(`${unblockusers}/${id}`)
      .then(({ data }) => {
        setBlock(!block);
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users?.length - page * rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">No</TableCell>

              <TableCell className="tableCell">First Name</TableCell>
              <TableCell className="tableCell">Last Name</TableCell>
              <TableCell className="tableCell">Email </TableCell>
              <TableCell className="tableCell">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? users?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : users
            ).map((user, index) => (
              <TableSingleRow
                key={user._id}
                user={user}
                index={index}
                blockStaff={blockStaff}
                unblockStaff={unblockStaff}
              />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default List;

function TableSingleRow({ user, index, blockStaff, unblockStaff }) {
  const [blockText, setBlockText] = useState("BLOCK");
  useEffect(() => {
    if (user.Block) {
      setBlockText("UNBLOCK");
    } else {
      setBlockText("BLOCK");
    }
  }, [user]);

  const toggleBlock = (userId) => {
    if (blockText === "BLOCK") {
      blockStaff(userId, () => {
        setBlockText("UNBLOCK");
      });
    } else {
      unblockStaff(userId);
      setBlockText("BLOCK");
    }
  };

  return (
    <TableRow key={index + 1}>
      <TableCell className="tableCell">{index + 1}</TableCell>
      <TableCell className="tableCell">{user.firstName}</TableCell>
      <TableCell className="tableCell">{user.lastName}</TableCell>
      <TableCell className="tableCell">{user.email}</TableCell>
      <TableCell align="left">
        <Button
          onClick={() => toggleBlock(user._id)}
          variant="contained"
          color="error"
        >
          {blockText}
        </Button>
      </TableCell>
    </TableRow>
  );
}
