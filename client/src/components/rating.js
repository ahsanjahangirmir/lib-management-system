import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
import LogOut from './logout';

const Rating = () => {
  const [staffFetched, setStaffFetched] = useState([]);
  const [staffExists, setStaffExists] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState(); // State variable to hold selected staff

  const handleStaffChange = (e) => {
    setSelectedStaff(e.target.value)
  }
  const navigate = useNavigate();

  // Use useEffect to run getStaff when the component mounts or when selectedStaff changes
  useEffect(() => {
    getStaff();
  }, []);
  useEffect(() => {
    console.log("Staff Fetched:", selectedStaff);
  }, [selectedStaff]);
  

  async function getStaff() {
    try {
      const res = await axios.post("http://localhost:3100/home", { type: "staff-fetch"});
      if (res.data === "exists=false") {
        alert("No staff exists.");
        setStaffExists(false);
      } else {
        setStaffExists(true);
        setStaffFetched(res.data);
      }
    } catch (e) {
      alert("Error in fetching staffs from the database.");
      console.error(e);
    }
  }

  async function submitRating(e) {
    e.preventDefault()
    console.log("Staff: ", selectedStaff)
    try {
      const res = await axios.post("http://localhost:3100/home", {
        staffMember: selectedStaff,
        ratingvalue: rating,
        type: "rating-submit"
      });
      if (res.data === "rating-submitted") {
        alert("Rating has been submitted");
      } else {
        alert("There was an error in submitting rating.");        
      }
    } catch (e) {
      alert("Error in submitting rating from the database.");
      console.error(e);
    }
  }

  return (
    <Container>
      <h1>Rating staff members based on their performance</h1>
      <h1>Select a Staff Member:</h1>
      <form  method="post">
        <div>
        <p>Select a staff member:</p>
        {staffExists && staffFetched.map((staff, index) => (
          <label key={index}>
            <input
              type="radio"
              name="staffMember"
              value={staff.Username}
              checked={selectedStaff === staff.Username}
              onChange={handleStaffChange}
            />
            {staff.Username}
          </label>
        ))}
          <p>Selected Staff: {selectedStaff}</p>
        </div>

        <label htmlFor="rating">Rating (0-10): </label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={rating}
          min="0"
          max="10"
          onChange={(e) => setRating(e.target.value)}
        />

        <button onClick={submitRating}>Submit Rating for Staff member</button>
      </form>
    </Container>
  );
};

export default Rating;
