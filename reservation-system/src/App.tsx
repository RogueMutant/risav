import React from "react";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Reservation } from "./pages/reservation";

function App() {
  return (
    <div className="App">
      {/* <Dashboard /> */}
      <Reservation />
      {/* <Login /> */}
      {/* <SignUp /> */}
    </div>
  );
}

export default App;
