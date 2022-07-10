import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AuthRedirect from "./pages/AuthRedirect/AuthRedirect";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth/redirect" element={<AuthRedirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
