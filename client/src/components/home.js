import React from "react"
import axios from 'axios';
import {Container} from "react-bootstrap"
import { useLocation, useNavigate, Link} from "react-router-dom";
import '../styles/login.css'
import AddStaff from './addstaff';
import AddStudent from './addstudent';
import LogOut from './logout';
import StudentRatingForm from './stdrating';
import ViewStudentFeedback from './viewrating';
import ViewStaffRanking from './staffranking';
import Rating from './rating';
import GeneralSearch from "./generalsearch";
import AddBook from "./addbook";
import StudentSearch from "./studentsearch";

// import {BrowserRouter, Link, useNavigate} from 'react-router-dom';

const Home = ()=>{
    const navigate = useNavigate();
    const location = useLocation();   
    const usernameNew = location.state.id;

      
    return (        
        <Container> 
            <h1>Hello {location.state.id} </h1>
            {location.state.position === "student" && 
                (
                    <div>
                        <h2>Welcome to the student menu </h2>
                        <StudentSearch username= {usernameNew}/>
                        <StudentRatingForm username={location.state.id}/>
                    </div>
                )
            }

            {location.state.position === "staff" && 
                (
                    <div>
                        <h2>Welcome to the staff menu </h2>
                        <AddStudent/>
                        <GeneralSearch />
                        <ViewStudentFeedback/>
                        <h1>Student Management</h1>
                        <AddBook/>
                    </div>
                )
            }

            {location.state.position === "manager" && 
                (
                    <div>
                        <h2>Welcome to the manager menu </h2>
                        <AddStaff />
                        <GeneralSearch />
                        <Rating/>
                        <ViewStaffRanking/>
                    </div>
                )
            }
            <LogOut/>
        </Container>
    )
}

export default Home

