import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  HomePage,
  ErrorPage,
  LoginPage,
  ForgotPasswordPage,
  CompleteProfilePage,
  DashBoardPage,
  CreateGamePage,
  PlayGamePage,
  ResetPassword,
} from "./Pages";
import "./App.css";
import { ToastComponent } from "./Components";
import { useSelector } from "react-redux";
import { RegisterModal } from "./Components/Modals";
import ProtectPage from "./Pages/Protected/ProtectPage";
const App = () => {
  const { openModal, user } = useSelector((store) => store.user);
  return (
    <BrowserRouter>
      <ToastComponent />
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route element={<ProtectPage data={user} />}>
          <Route path="/dashboard" index element={<DashBoardPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/create-game" element={<CreateGamePage />} />

          <Route path="/play-game" element={<PlayGamePage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {openModal.show && <RegisterModal msg={openModal.msg} />}
    </BrowserRouter>
  );
};

export default App;
