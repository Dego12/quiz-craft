import React from "react";
import { Header } from "./pages/Header";
import "react-widgets/styles.css";
import "./App.css";
import "./styles/HeaderStyle.css";
import "./styles/MainPageStyle.css";
import "./styles/QuizStyle.css";
import "./styles/QuestionStyle.css";
import "./styles/EnterPage.css";
import "./styles/HostStyle.css";
import "./styles/ForgotPasswordModalStyle.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import { MainPage } from "./pages/MainPage";
import { QuizPage } from "./pages/QuizPage";
import redirects from "./resources/redirects.json"
import { EnterPage } from "./pages/EnterPage";
import { PlayQuizPage } from "./pages/PlayQuizPage";
import { HostPage } from "./pages/HostPage"
import { initializeIcons } from "@fluentui/react";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

initializeIcons();
function App() {
  return (

      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path={redirects.LandingPage} element={<Header />}></Route>
          <Route path={redirects.Signup} element={<SignUpPage />}></Route>
          <Route path={redirects.ResetPasswordPage + "/:" + redirects.ResetPasswordTokenParam} element={<ResetPasswordPage />}></Route>
          <Route path={redirects.Login} element={<LoginPage />}></Route>
          <Route path={redirects.MainPage} element={<MainPage />}></Route>
          <Route path={redirects.QuizPage} element={<QuizPage />}></Route>
          <Route path={redirects.QuizPage + "/:" + redirects.QuizIdParam} element={<QuizPage />} ></Route>
          <Route path={redirects.GuestEnterPage + "/:" + redirects.PINParam} element={<EnterPage />}></Route>
          <Route path={redirects.PlayQuizPage + "/:" + redirects.RoomIdParam} element={<PlayQuizPage />}></Route>
          <Route path={redirects.HostPage + "/:" + redirects.RoomIdParam} element={<HostPage />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
