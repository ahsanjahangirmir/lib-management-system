import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';

const Rating = () => {
  const [ratingSet, setratingsExist] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [ratings, setRatings] = useState();

  useEffect(() => {
    getRatings();
    }, []);

  async function getRatings() {
    try {
      const res = await axios.post("http://localhost:3100/home", { type: "ratings-fetch"});
      if (res.data === "exists=false") 
      {
        alert("No ratings submitted by students.");
        setratingsExist(false);
      } 
      else 
      {
        setratingsExist(true);
        setRatings(res.data);
      }
    } 
    catch(e) 
    {
      alert("Error in fetching staffs from the database.");
      console.error(e);
    }
  }

  const toggleContent = () => {
    setIsContentVisible((prevIsContentVisible) => !prevIsContentVisible);
  };

  return (
    <Container>
      <h1>View Ratings</h1>
        <button onClick={toggleContent}>Toggle Student Ratings</button> 
        {isContentVisible && ratingSet && 
            <div>
                {ratingSet && ratings.map((ratings, index) => (
                    <h5 key={index}> Student: {ratings.Username} 
                        <p key={index}> Rating: {ratings.Rating} </p>
                        <p key={index}> Comments: {ratings.Comments} </p>
                    </h5>
                ))}
            </div>    
        }
    </Container>
  );
};

export default Rating;
