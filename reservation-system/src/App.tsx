import React from "react";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";

function App() {
  return (
    <div className="App">
      <Dashboard />
      {/* <Login /> */}
      {/* <SignUp /> */}
    </div>
  );
}

export default App;
