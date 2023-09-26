import React from "react"
import PlayerBanner from "../../assets/bay-area-mini.jpeg"
import HeroSection from "../styled/HeroSection"

const PlayerDatabase = () => {
	return (
		<div>
			<HeroSection imgUrl={PlayerBanner} backgroundPosition="top">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Players</h1>
			</HeroSection>
			<h1>Norcal Player Database</h1>
			<p>Due to data size limitations, this database will only show players that have attended a norcal tournament within the current year</p>
		</div>
	)
}

export default PlayerDatabase