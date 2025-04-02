import React from "react"
import axios from 'axios';
import {Container} from "react-bootstrap"
import '../styles/login.css'
import {BrowserRouter, Link, useNavigate} from 'react-router-dom';

const Login = (prop)=>{
    
    return (        
        <Container> 
            <Link to = "/login"> Login </Link>
            <Link to = "/signup"> Sign-up </Link>
        </Container>
    )

}

export default Login

