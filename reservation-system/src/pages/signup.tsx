import React, { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useFetch } from "../hooks/useFetch";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

interface Person {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface SubmitEvent {
  preventDefault: () => void;
}

const url = "/auth/register";
export const SignUp = () => {
  const [person, setPerson] = useState<Person>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [shouldFetch, setShouldFetch] = useState(false);
  const [error, setError] = useState("");
  const {
    data,
    error: signUpError,
    loading,
    fetchData,
  } = useFetch(url, shouldFetch, "post");

  const [PasswordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

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

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    if (!person.name || !person.email || !person.password) {
      console.log("Fields cannot be empty");
      return;
    }
    if (person.password !== person.confirmPassword) {
      console.log("Passwords do not match");
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await fetchData(
        {
          name: person.name.trim(),
          email: person.email.trim(),
          password: person.password,
        },
        "post"
      );
      if (response) {
        console.log("Sign up successful");
        setPerson({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      if (signUpError) {
        console.error("Detailed error:", signUpError);
      }
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      setPerson({ name: "", email: "", password: "", confirmPassword: "" });
      setShouldFetch(false);
      navigate("/user-dashboard");
    }
  }, [data, navigate]);

  if (signUpError) {
    console.error(signUpError);
  }
  return (
    <article className="login-container">
      <h1>RISAV</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Create New Account</h2>
        <p onClick={() => navigate("/login")}>
          Have an account? <span style={{ color: "#a0dfd8" }}>Log In</span>
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
          {signUpError && <p style={{ color: "red" }}>{signUpError}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? <FaSpinner /> : "Sign Up"}
          </button>
        </div>
      </form>
    </article>
  );
};
