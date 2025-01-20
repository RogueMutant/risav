import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../styles/index.css";
declare var axios: any;

interface Person {
  email: string;
  password: string;
}

export const Login = () => {
  const [person, setPerson] = useState<Person>({ email: "", password: "" });
  const [users, setUsers] = useState<Person[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser = { email: person.email, password: person.password };
    console.log(newUser);
    const updateUsers = { ...person, ...newUser };
    setUsers((prevUsers) => [...prevUsers, updateUsers]);
    setPerson({ email: "", password: "" });
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
              type="password"
              name="password"
              id="password"
              value={person.password}
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
