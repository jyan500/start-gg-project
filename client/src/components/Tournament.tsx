import React, { useEffect, useState } from "react"
import TournamentCard from "./TournamentCard"
import api from "../config/api"

const Tournament = () => {
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
		<div>
            {data.length ? data.map(tournament => (  
                <TournamentCard tournament={tournament}></TournamentCard>
            )) : null} 
        </div>
	)
}

export default Tournament