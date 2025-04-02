import React from "react";
import axios from 'axios';
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = (prop) => {
    const history = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [occupation, setOccupation] = React.useState('student');

    async function submitForm(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3100/login", {
                username,
                password,
                occupation
            });
            if (res.data === "exists=true")         
            {
                if (occupation === "student")
                {
                    history("/home", {state: {id: username, position: "student"}});
                }
                else if (occupation === "staff")
                {
                    history("/home", {state: {id: username, position: "staff"}});
                }
                else 
                {
                    history("/home", {state: {id: username, position: "manager"}});
                }
            } 
            else if (res.data === "exists=false")
            {
                alert("Incorrect username or password");
            }
        } 
        catch (e) 
        {
            alert("Error in sending username password to server");
            console.log(e);
        }
    }

    return (
        <div className="login-page">
            <div className="login-header"> Library Management <span className="lib-name">System</span></div>
            <div className='partition'></div>
            <form className='form'>
                <div>
                    <select
                        className="occupation-dropdown"
                        value={occupation}
                        onChange={(e) => { setOccupation(e.target.value) }}
                    >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
                <div>
                    <input
                        className="user-inp"
                        type='username'
                        placeholder='username'
                        onChange={(e) => { setUsername(e.target.value) }}
                    />
                </div>
                <div>
                    <input
                        className="pass-inp"
                        type='password'
                        placeholder='password'
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                </div>
                <div>
                    <button className="sub-button" onClick={submitForm}>Login Now</button>
                </div>
            </form>
            <div className="question">
                Don't have an account? <Link to="/signup">Signup</Link>
            </div>
        </div>
    );
}

export default Login;
