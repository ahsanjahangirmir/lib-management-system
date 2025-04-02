import React from "react"
import {Container} from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../styles/login.css'
import { Route, Routes } from 'react-router-dom';
import Login from "./login";
// import {BrowserRouter, Link, useNavigate} from 'react-router-dom';

const Home = ()=>{
    return (        
        <Container> 
            <Link to = "/login"> Logout </Link>
        </Container>
    )
}

export default Home

