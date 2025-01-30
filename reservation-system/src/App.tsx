import React from "react";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Reservation } from "./pages/reservation";
import { Profile } from "./pages/settings";
import { NotFound } from "./pages/notfound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/settings" element={<Profile />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
