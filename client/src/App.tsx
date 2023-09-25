import React, {useEffect, useState} from 'react';
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
                <div className="flex">
                    <div className = "h-screen sticky top-0">
                        <SideBar></SideBar>
                    </div>
                    <div className="flex-1">
                        <div>
                            <Routes>
                                <Route path="/" element={<Home/>}></Route> 
                                <Route path="/tournaments" element={<Tournament/>}></Route>    
                                <Route path="/players" element={<Player/>}></Route>    
                            </Routes>
                        </div>
                        <Footer></Footer>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
