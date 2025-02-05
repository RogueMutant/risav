import React, { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../styles/index.css";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

interface Person {
  email: string;
  password: string;
}

const url = "http://localhost:9000/auth/login";

export const Login = () => {
  const [person, setPerson] = useState<Person>({ email: "", password: "" });
  const [shouldFetch, setShouldFetch] = useState(false);
  const { loading, data, error, fetchData } = useFetch(
    url,
    shouldFetch,
    "post"
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  const redirectToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    if (shouldFetch) {
      fetchData(person);
      setShouldFetch(false);
    }
    if (data) {
      console.log(data);
      setPerson({ email: "", password: "" });
      redirectToDashboard();
    }
  }, [shouldFetch, fetchData, person, data, redirectToDashboard]);

  if (error) {
    console.error("Login error:", error);
  }
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
