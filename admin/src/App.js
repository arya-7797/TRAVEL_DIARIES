import Login from "./pages/Login/Login";
import Homepage from "./pages/Home/Homepage";
import { Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { DarkModeContext } from "./context/darkModeContext";
import PostsList from "./pages/Posts/PostsList";
import Reports from "./pages/Reports/Reports";
import Single from "./pages/userList/Single";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const token = useSelector((state) => state.token);

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/">
          <Route
            index
            element={token ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/users-list"
            element={token ? <Single /> : <Navigate to="/login"></Navigate>}
          />
          <Route
            path="/posts"
            element={token ? <PostsList /> : <Navigate to="/login"></Navigate>}
          />
          <Route
            path="/reports"
            element={token ? <Reports /> : <Navigate to="/login"></Navigate>}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
