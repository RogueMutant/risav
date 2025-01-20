import React, { useActionState, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../styles/index.css";

interface Person {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface SubmitEvent {
  preventDefault: () => void;
}
export const SignUp = () => {
  const [person, setPerson] = useState<Person>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState<Person[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (person.name && person.email && person.password) {
      const newPerson = {
        name: person.name,
        email: person.email,
        password: person.password,
        confirmPassword: person.confirmPassword,
      };
      const updatedPerson = { ...person, ...newPerson };
      setUser((prevUser) => [...prevUser, updatedPerson]);
      setPerson({ name: "", email: "", password: "", confirmPassword: "" });
    }
  };
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
              type="password"
              name="password"
              id="password"
              value={person.password}
              onChange={handleChange}
              required
            />
            <BsEye className="eye open-eye" />
            <BsEyeSlash className="eye eyeslash" />
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={person.confirmPassword}
              onChange={handleChange}
            />
            <BsEye className="eye open-eye" />
            <BsEyeSlash className="eye eyeslash" />
          </div>
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
