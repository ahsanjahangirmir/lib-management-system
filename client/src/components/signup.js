import React from "react";
import axios from "axios";
import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Signup = (prop) => {
  const history = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [number, setNumber] = React.useState(0);
  const [salary, setSalary] = React.useState(0);
  const [gender, setGender] = React.useState("");
  const [occupation, setOccupation] = React.useState("student");

  async function submitForm(e) {
    e.preventDefault();

    // Check for valid username and password
    if (username.length < 4) 
    {
      alert("Username must be at least 4 characters long.");
      return;
    }
    if (number.length < 10) 
    {
        alert("Number must be at least 10 characters long.");
        return;
    }
    if (password.length < 4) 
    {
      alert("Password must be at least 4 characters long.");
      return;
    }
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /\d/;

    if (!numberRegex.test(password)) 
    {
        alert("Password must contain at least one number.");
        return;
    }
    if (!specialCharacterRegex.test(password)) 
    {
        alert("Password must contain at least one special character.");
        return;
    }

    try {
      const response = await axios.post("http://localhost:3100/signup", {
        username,
        password,
        number,
        gender,
        salary,
        occupation,
      });

      if (response.data === "exists=true") {
        history("/home", { state: { id: username, position: occupation } });
      } else if (response.data === "exists=false") {
        console.log("Creating new user");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-page">
      <div className="login-header">
        {" "}
        Management <span class="lib-name">System</span>
      </div>
      <div className="partition"></div>
      <form className="form" action="POST">
        <div>
          <select
            className="occupation-dropdown"
            value={occupation}
            onChange={(e) => {
              setOccupation(e.target.value);
            }}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <input
            className="user-inp"
            required
            type="username"
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            className="pass-inp"
            required
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            className="user-inp"
            required
            type="number"
            placeholder="Phone number"
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
        </div>
        {occupation === "student" && (
          <div>
            <select
              required
              className="user-inp"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="M" disabled selected>
                Male
              </option>
              <option value="F">Female</option>
            </select>
          </div>
        )}
        {occupation === "staff" && (
          <div>
            <input
              className="user-inp"
              required
              type="number"
              placeholder="Salary"
              onChange={(e) => {
                setSalary(e.target.value);
              }}
            />
          </div>
        )}
        <div>
          <button className="sub-button" onClick={submitForm}>
            Sign Up!
          </button>
        </div>
        <div className="question">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
