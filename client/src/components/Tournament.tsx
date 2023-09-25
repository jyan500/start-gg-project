import React, { useEffect, useState } from "react"
import TournamentCard from "./TournamentCard"
import { Tournament as TournamentType } from "../types/common"
import TournamentHeroImage from "../assets/spice-tournament-2.jpeg"
import api from "../config/api"
import useSWR from "swr"
import HeroSection from "./styled/HeroSection"

const fetcher = (url: string) => api.get(url).then(res => res.data)

const Tournament = () => {
	const {data, error} = useSWR("/tournaments", fetcher)
	return (
		<div>
			<HeroSection imgUrl={TournamentHeroImage} backgroundPosition="center">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Tournaments</h1>
			</HeroSection>
            {data?.map((tournament: TournamentType) => (  
                <TournamentCard tournament={tournament}></TournamentCard>
            ))} 
        </div>
	)
}


export default Tournament