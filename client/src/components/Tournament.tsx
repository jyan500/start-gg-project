import React, { useEffect, useState } from "react"
import TournamentCard from "./TournamentCard"
import { Tournament as TournamentType } from "../types/common"
import TournamentHeroImage from "../assets/spice-tournament-2.jpeg"
import api from "../config/api"
import useSWR from "swr"
import styled from "styled-components"

const fetcher = (url: string) => api.get(url).then(res => res.data)

const Tournament = () => {
	const {data, error} = useSWR("/tournaments", fetcher)
	return (
		<div>
			<HeroSection imgUrl={TournamentHeroImage}>
				<h1 style={{fontSize: "64px", color: "white"}}>Tournaments</h1>
			</HeroSection>
            {data?.map((tournament: TournamentType) => (  
                <TournamentCard tournament={tournament}></TournamentCard>
            ))} 
        </div>
	)
}

const HeroSection = styled.section<{imgUrl: string}>`
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to bottom, #0a0c2c80 3rem, transparent 10rem), ${(props) => `url(${props.imgUrl})`};
	background-size: cover;
	background-position: center;
	height: 48vh;
`

export default Tournament