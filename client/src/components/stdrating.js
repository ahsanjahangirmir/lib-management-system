import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
import LogOut from './logout';

const Rating = (props) => {
  const [ratingGiven, setRating] = useState(0);
  const [commentsGiven, setComments] = useState('');
  

  const handleComments = (event) => {
    setComments(event.target.value);
  };

  async function submitRating(e) {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3100/home", {
        rating: ratingGiven,
        comment: commentsGiven,
        username: props.username,
        type: "std-rating-submit"
      });
      if (res.data === "std-rating-submitted") 
      {
        alert("Rating has been submitted by Student");
      } 
      else 
      {
        alert("There was an error in submitting student rating.");
        console.log(res.data);        
      }
    } 
    catch (e) 
    {
      alert("Error in submitting student rating from the database.");
      console.error(e);
    }
  }

  return (
    <Container>
      <h1>Rate your library experience</h1>
      <form  method="post">
        <div>
            <label htmlFor="rating">Rating (0-10): </label>
            <input
            type="number"
            id="rating"
            name="rating"
            value={ratingGiven}
            min="0"
            max="10"
            onChange={(e) => setRating(e.target.value)}
            />
        </div>
        <div>
            <span>Enter Comments</span>
            <input
            type="text"
            value={commentsGiven}
            onChange={handleComments}
            placeholder="Enter Comments here if any"
            />
        </div>
        <button onClick={submitRating}>Submit experience Rating</button>
      </form>
    </Container>
  );
};

export default Rating;
