import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import { FaSpinner } from "react-icons/fa";

interface Person {
  email: string;
  password: string;
}

export const Login = () => {
  const [person, setPerson] = useState<Person>({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error: loginError } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Login attempt with:", {
        email: person.email,
        password: person.password.length,
      });
      await login(person.email, person.password);
      setPerson({ email: "", password: "" });
    } catch (err) {
      console.error("Login error details:", loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="login-container">
      <h1>RISAV</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <p onClick={() => navigate("/signUp")}>
          Don't have an account?{" "}
          <span style={{ color: "#a0dfd8" }}>Sign up</span>
        </p>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={person.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={person.password}
              onChange={handleChange}
              required
            />
            <span onClick={togglePasswordVisibility} className="eye">
              {passwordVisible ? <BsEyeSlash /> : <BsEye />}
            </span>
          </div>
        </div>
        <div className="form-control">
          {loginError && (
            <p style={{ color: "red", margin: "0px" }}>{loginError}</p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? <FaSpinner /> : "Log In"}
          </button>
        </div>
      </form>
    </article>
  );
};
