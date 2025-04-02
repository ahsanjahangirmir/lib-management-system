import React, { useState } from 'react';
import axios from 'axios';

const UserDeletionForm = () => {
  const [userOperation, setUserOperation] = useState('delete');
  const [userToBeDeleted, setUserToBeDeleted] = useState('');

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [number, setNumber] = React.useState(0);
  const [gender, setGender] = React.useState("M");

  const handleOperationChange = (event) => {
    setUserOperation(event.target.value);
  };

  const handleInputChange = (event) => {
    if (userOperation === 'delete') {
      setUserToBeDeleted(event.target.value);
    } else {
      setGender(event.target.value);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (userOperation === 'delete') 
    {
      console.log('User to be deleted:', userToBeDeleted);
      try {
        const res = await axios.post("http://localhost:3100/home",
          {
            type: "delete-student",
            user: userToBeDeleted
          });
        if (res.data === "student-exist-false") {
          alert("No such Student exists.");
        } else {
          alert("Student deleted!");
        }
      } catch (e) {
        alert("Error in fetching students from the database.");
        console.error(e);
      }
    } 
    else 
    {
      if (username.length < 4) 
      {
        alert("Username must be at least 4 characters long.");
        return;
      }
      if (password.length < 4) 
      {
        alert("Password must be at least 4 characters long.");
        return;
      }
      if (number.length < 10) 
      {
        alert("Number must be at least 10 characters long.");
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
      console.log('Gender:', gender);
      try {
        const res = await axios.post("http://localhost:3100/home",
          {
            type: "add-student",
            username,
            password,
            number,
            gender
          });
        if (res.data === "student-added") {
          alert("New Student added.");
        } else {
          alert("Student couldn't be added.");
        }
      } catch (e) {
        alert("Error in adding students to the database.");
        console.error(e);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Operation Type:
        <select value={userOperation} onChange={handleOperationChange}>
          <option value="delete">Delete Student</option>
          <option value="add">Add Student</option>
        </select>
      </label>
      {userOperation === 'delete' ? (
        <div>
          <label>
            User to be deleted:
            <input
              type="text"
              value={userToBeDeleted}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Delete Student</button>
        </div>
      ) : (
        <div>
          <div>
            <label>Enter username</label>
            <input required type='text' placeholder='username' onChange={(e) => { setUsername(e.target.value) }} />
          </div>
          <div>
            <label>Enter password</label>
            <input required type='password' placeholder='password' onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          <div>
            <label>Enter number</label>
            <input required type='number' placeholder='Phone number' onChange={(e) => { setNumber(e.target.value) }} />
          </div>
          <div>
            <label>Enter gender</label>
            <select required onChange={(e) => setGender(e.target.value)}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <button type="submit">Add User</button>
        </div>
      )}
    </form>
  );
};

export default UserDeletionForm;
