import React from "react";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Reservation } from "./pages/reservation";
import { Profile } from "./pages/profile";
import { NotFound } from "./pages/notfound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ResourceList } from "./components/resourcelist";
import { CategoryPage } from "./pages/categories";
import { ResourceProvider } from "./components/resourceContext";
import { AuthProvider } from "./components/authContext";
import { Settings } from "./pages/settings";
import { CurrentReservation } from "./pages/currentReservation";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ResourceProvider>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/reservation/:reservationPage"
              element={<Reservation />}
            />
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ResourceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
