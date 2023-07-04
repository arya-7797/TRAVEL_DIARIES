import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Table from "../../components/table/Table";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllUsers, setReports, setPosts } from "../../Redux/store";
import axios from "../../utils/axios";

const Home = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.allUsers);
  const token = useSelector((state) => state.token);

  const getAllPosts = () => {
    axios
      .get("/post/posts", {
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
  const getAllReports = () => {
    axios
      .get("admin/getAllReports", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("inside repo then");
        dispatch(setReports({ reports: response.data }));
      })
      .catch((error) => {
        console.log("inside repo catch");
        console.log(error);
      });
  };
  const getAllUsers = () => {
    axios
      .get("admin/getAllUsers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("ala use ", response.data);
        dispatch(setAllUsers({ allUsers: response.data }));
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getAllPosts();
    getAllReports();
  }, []);

  const navigateToUsers = () => {
    alert("hurray ");
  };
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="posts" />
          <Widget type="reports" />
        </div>
        <div className="charts"></div>
        <div className="listContainer">
          <div className="listTitle">All The users</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
