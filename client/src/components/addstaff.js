import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';

const UserDeletionForm = () => {
  const [userOperation, setUserOperation] = useState('delete');
  const [userToBeDeleted, setUserToBeDeleted] = useState('');
  const [newUser, setNewUser] = useState('');

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [number, setNumber] = React.useState(0)
  const [salary, setSalary] = React.useState(0)

  const handleOperationChange = (event) => 
  {
    setUserOperation(event.target.value);
  };

  const handleInputChange = (event) => 
  {
    if (userOperation === 'delete') 
    {
      setUserToBeDeleted(event.target.value);
    } 
    else 
    {
      setNewUser(event.target.value);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (userOperation === 'delete') 
    {
      console.log('User to be deleted:', userToBeDeleted);
      try 
      {
        const res = await axios.post("http://localhost:3100/home",
          {
            type: "delete-staff",
            user: userToBeDeleted
          });
        if (res.data === "staff-exist-false") {
          alert("No such staff exists.");
        } else {
          alert("Staff deleted!");
        }
      } 
      catch (e) 
      {
        alert("Error in fetching staffs from the database.");
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
      console.log('User to be added:', newUser);
      try 
      {
        const res = await axios.post("http://localhost:3100/home",
          {
            type: "add-staff",
            username,
            password,
            number,
            salary
          });
        if (res.data === "staff-added") 
        {
          alert("New staff added.");
        } 
        else 
        {
          alert("Staff couldn't be added.");
        }
      } 
      catch (e) 
      {
        alert("Error in adding staffs to the database.");
        console.error(e);
      }
    }
  }

  return (
    <Container>
      <h1>Add/Remove Staff members</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Operation Type:
          <select value={userOperation} onChange={handleOperationChange}>
            <option value="delete">Delete User</option>
            <option value="add">Add User</option>
          </select>
        </label>
        {userOperation === 'delete' ? 
        (
          <div>
              <label>
                User to be deleted:
                <input
                  type="text"
                  value={userToBeDeleted}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit" onClick={handleSubmit}>Delete User</button>
          </div>
        ) : 
        (
          <div>
              <div>
                  <label>Enter username</label>
                  <input  required type='username' placeholder='username'  onChange={(e) => {setUsername(e.target.value)}}/>
              </div>
              <div>
                  <label>Enter password</label>
                  <input  required type='password' placeholder='password'  onChange={(e) => {setPassword(e.target.value)}}/>
              </div>
              <div>
                  <label>Enter number</label>
                  <input  required type='number' placeholder='Phone number'  onChange={(e) => {setNumber(e.target.value)}}/>                    
              </div>
              <div>
                  <label>Enter salary</label>
                  <input  required type='number' placeholder='Salary'  onChange={(e) => {setSalary(e.target.value)}}/>
              </div>    
              <button type="submit" onClick={handleSubmit}>Add User</button>
          </div>
        )}
      </form>
    </Container>
  );
};

export default UserDeletionForm;
