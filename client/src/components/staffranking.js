import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import '../styles/login.css';

const Rating = () => {
  const [exists, setExists] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    getRankings();
    }, []);

  const getRankings = async () => {
    try {
      const res = await axios.post("http://localhost:3100/home", { type: "staff-ranking" });
      if (res.data === "exists=false") {
        alert("No staff rankings exist.");
        setExists(false);
      } else {
        setRankings(Object.entries(res.data));
        console.log("Data received: ", rankings);
        setExists(true);
      }
    } catch (e) {
      alert("Error in fetching staffs from the database.");
      console.error(e);
    }
  };

  const toggleContent = () => {
    getRankings();
    setIsContentVisible((prevIsContentVisible) => !prevIsContentVisible);
  };

  return (
    <Container>
      <h1>View Staff Rankings</h1>
      <button onClick={toggleContent}>Toggle Staff Rankings</button>
      {isContentVisible && exists && (
        <div>
          {rankings.map((ratings, index) => (
            <h5 key={index}>
              <p> Staff Name: {ratings[0]} </p>
              <p> Rating: {ratings[1]} </p>
            </h5>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Rating;
