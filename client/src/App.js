import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import React, { useEffect } from "react";
import Mobile from "components/Otp/Mobile";
import Otp from "components/Otp/Otp";
import CommunityChat from "scenes/Community/CommunityChat";
import Notifications from "components/Notifications/Notifications";
import RoomPage from "scenes/Community/Room";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useState } from "react";

function App() {
  const [mobile, setMobile] = useState(true);
  const [userNumber, setUserNumber] = useState("");
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const token = useSelector((state) => state.token);
  const currentUserRedux = useSelector((state) => state.user);
  console.log("ee", currentUserRedux);

  const changeStatus = (userNumber) => {
    setUserNumber(userNumber);
    setMobile(false);
  };

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/login"
              element={!token ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route path="/">
              <Route
                index
                element={token ? <HomePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile/:userId"
                element={token ? <ProfilePage /> : <Navigate to="/login" />}
              />
              <Route path="/chat" element={<CommunityChat />} />
              <Route
                path="/mobile"
                element={<Mobile status={changeStatus} />}
              />
              <Route path="/otp" element={<Otp userNumber={userNumber} />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/room/:roomId" element={<RoomPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
