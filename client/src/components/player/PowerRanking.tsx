import React from "react"
import RecentPR from "../../assets/winter-2022-2023-norcal-PR.jpeg"
import HeroSection from "../styled/HeroSection"
import PlayerBanner from "../../assets/bay-area-mini.jpeg"
import Falco from "../../assets/falco.gif"
import Falcon from "../../assets/falcon.gif"
import Fox from "../../assets/fox.gif"
import Pikachu from "../../assets/pikachu.gif"
import Marth from "../../assets/marth.gif"
import Sheik from "../../assets/sheik.gif"

const PowerRanking = () => {
	return (
		<div>
			<HeroSection  imgUrl={PlayerBanner} backgroundPosition="top">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Players</h1>
			</HeroSection>
			<div className = "p-8">
				<div className = "p-4">
					<h1 className = "text-center text-6xl"> Winter 2022-23 PR </h1>
				</div>
				<img src={RecentPR}></img>
				<h1 className="text-4xl"><a href="https://www.ssbwiki.com/NorCal_Power_Rankings">Previous PRs</a></h1>
			</div>
		</div>
	)
}
export default PowerRanking