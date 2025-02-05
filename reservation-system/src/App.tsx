import React from "react";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Reservation } from "./pages/reservation";
import { Profile } from "./pages/settings";
import { NotFound } from "./pages/notfound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ResourceList } from "./components/resourcelist";
import { CategoryPage } from "./pages/categories";
import { ResourceProvider } from "./components/resourceContext";

function App() {
  return (
    <Router>
      <ResourceProvider>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ResourceProvider>
    </Router>
  );
}

export default App;
