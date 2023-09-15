import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import api from "./config/api"
import Header from "./components/Header"
import Footer from "./components/Footer"
import TournamentCard from "./components/TournamentCard"
import { Tournament, SinglesParticipant, DoublesParticipant } from "./types/common"

const App = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const get = async () => {
            const res = await api.get("/tournaments")
            try{
                setData(res.data)
            }
            catch(err) {
                console.log(err)
            }
        }
        get()
    }, [])

    return (
        <div className="App">
            <Header></Header>
            <div>
                {data.length ? data.map(tournament => (  
                    <TournamentCard tournament={tournament}></TournamentCard>
                )) : null} 
            </div>
            <Footer></Footer>
        </div>
    );
}

export default App;
