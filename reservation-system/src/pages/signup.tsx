import React, { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useFetch } from "../components/useFetch";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";

interface Person {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface SubmitEvent {
  preventDefault: () => void;
}
interface User {
  name: string;
  email: string;
  password: string;
}
const url = "http://localhost:9000/auth/register";
export const SignUp = () => {
  const [person, setPerson] = useState<Person>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error, loading, fetchData } = useFetch<any>(
    url,
    shouldFetch,
    "post"
  );
  const [PasswordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const navigateToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const togglePasswordVisibility = (
    fieldName: "password" | "confirmPassword"
  ) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
    console.log(PasswordVisibility);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const createUser = () => {
    fetchData(person);
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (
      person.name &&
      person.email &&
      person.password &&
      person.password === person.confirmPassword
    ) {
      setShouldFetch(true);
      createUser();
    } else {
      if (person.password !== person.confirmPassword) {
        alert("Passwords do not match");
      } else {
        alert("Please fill in all fields");
      }
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      setPerson({ name: "", email: "", password: "", confirmPassword: "" });
      setShouldFetch(false);
      navigateToDashboard();
    }
  }, [data, navigateToDashboard]);

  if (error) {
    console.error(error);
  }
  return (
    <article className="form-container">
      <h1>RISAV</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Create New Account</h2>
        <p>
          Have an account? <a href="#top">Log In</a>
        </p>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={person.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={person.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={PasswordVisibility.password ? "text" : "password"}
              name="password"
              id="password"
              value={person.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => togglePasswordVisibility("password")}
              className="eye"
            >
              {PasswordVisibility.password ? <BsEyeSlash /> : <BsEye />}
            </span>
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              type={PasswordVisibility.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={person.confirmPassword}
              onChange={handleChange}
            />
            <span
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="eye"
            >
              {PasswordVisibility.confirmPassword ? <BsEyeSlash /> : <BsEye />}
            </span>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? loading : "Log In"}
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
