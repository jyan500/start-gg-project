import React from "react"
import RecentPR from "../assets/winter-2022-2023-norcal-PR.jpeg"
import HeroSection from "./styled/HeroSection"
import PlayerBanner from "../assets/bay-area-mini.jpeg"

const Player = () => {
	return (
		<div>
			<HeroSection  imgUrl={PlayerBanner} backgroundPosition="top">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Players</h1>
			</HeroSection>
			<img src={RecentPR}></img>
		</div>
	)
}
export default Player