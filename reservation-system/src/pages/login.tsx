import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../styles/index.css";

export const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  interface User {
    email: string;
    password: string;
  }

  interface ChangeEvent {
    target: {
      value: string;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    const email = e.target.value;
    const password = e.target.value;

    setUser({ email, password });
  };
  interface SubmitEvent {
    preventDefault: () => void;
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    console.log(user.email, user.password);
  };
  return (
    <article className="form-container">
      <h1>RISAV</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <p>
          Don't have an account? <a href="#top">Sign up</a>
        </p>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            //value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type="password"
              name="password"
              id="password"
              //value={user.password}
              onChange={handleChange}
            />
            <BsEye className="eye open-eye" />
            <BsEyeSlash className="eye eyeslash" />
          </div>
        </div>
        <div className="form-control">
          <input
            type="checkbox"
            style={{ height: "15px" }}
            name="checkbox"
            id="checkbox"
            className="check"
          />
          <label htmlFor="checkbox">Keep me signed in</label>
          <button type="submit">Log In</button>
        </div>
        <div className="hr"></div>
        <span>Or sign in using:</span>
        <div className="form-control">
          <button className="oauth">
            <FcGoogle /> <span>Google</span>
          </button>
        </div>
      </form>
    </article>
  );
};
