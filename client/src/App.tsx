import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header"
import Footer from "./components/Footer"
import SideBar from "./components/SideBar"
import Player from "./components/Player"
import Tournament from "./components/Tournament"
import Home from "./components/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const App = () => {
   

    return (
        <div className="App">
            <Router>
                <div style = {{display: "flex"}}>
                    <div>
                        <SideBar></SideBar>
                    </div>
                    <div style= {{flex: 1}}>
                        <Header></Header>
                        <Routes>
                            <Route path="/" element={<Home/>}></Route> 
                            <Route path="/tournaments" element={<Tournament/>}></Route>    
                            <Route path="/players" element={<Player/>}></Route>    
                        </Routes>
                        <Footer></Footer>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
