import './App.css';
import { Route, Routes } from 'react-router-dom';
import {BrowserRouter, Link} from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import MainPage from './components/main';
import SignUp from './components/signup';

function App() {
  
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPage/>}/>                    
            <Route path="/home" element={<Home/>}/>                    
            <Route path="/login" element={<Login/>}/>                    
            <Route path="/signup" element={<SignUp/>}/>      
        </Routes>
      </BrowserRouter>
    
  )
}

export default App;
