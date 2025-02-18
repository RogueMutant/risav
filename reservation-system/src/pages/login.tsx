import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../styles/index.css";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../components/authContext";

interface Person {
  email: string;
  password: string;
}

export const Login = () => {
  const [person, setPerson] = useState<Person>({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
      console.error("Login error details:", err);
    } finally {
      setLoading(false);
    }
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
            />
            <span onClick={togglePasswordVisibility} className="eye">
              {passwordVisible ? <BsEyeSlash /> : <BsEye />}
            </span>
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
          <button type="submit" disabled={loading}>
            {loading ? "Loading" : "Log In"}
          </button>
        </div>
        <div className="hr"></div>
        <span className="span-sign-in">Or sign in using:</span>
        <div className="form-control">
          <button className="oauth">
            <FcGoogle /> <span>Google</span>
          </button>
        </div>
      </form>
    </article>
  );
};
