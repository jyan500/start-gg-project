import React from 'react';
import Footer from "./components/Footer"
import SideBar from "./components/SideBar"
import PowerRanking from "./components/player/PowerRanking"
import PlayerDatabase from "./components/player/PlayerDatabase"
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
                                <Route path="/players/power-ranking" element={<PowerRanking/>}></Route>    
                                <Route path="/players/database" element={<PlayerDatabase/>}></Route>    
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
