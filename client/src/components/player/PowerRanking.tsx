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
			<h1 className = "text-6xl"> Winter 2022-23 PR </h1>
			<img src={RecentPR}></img>
			<h1 className = "text-4xl">Character Representation</h1>
			<img width = "80" height = "120" src={Falco}></img>
			<ul><li>Rom</li></ul>
			<img width = "80" height = "120" src={Falcon}></img>
			<ul>
				<li>S2J</li>
				<li>SpacePigeon</li>
			</ul>
			<img width = "80" height = "120" src={Marth}></img>
			<ul>
				<li>Umarth</li>
				<li>Typhoon</li>
				<li>Pancakes</li>
				<li>RedPandaMaster</li>
				<li>Depp</li>
				<li>Aerius</li>
				<li>Arcadia</li>
			</ul>
			<img width = "80" height = "120" src={Sheik}></img>
			<ul>
				<li>Shroomed</li>
				<li>Darkatma</li>
				<li>BigDK</li>
			</ul>
			<img width = "80" height = "120" src={Fox}></img>
			<ul>
				<li>Mojoe</li>
				<li>Blargh257</li>
				<li>Darkwizard123</li>
				<li>Kevbot</li>
				<li>Snap</li>
				<li>PRZ</li>
			</ul>
			<img width = "80" height = "120" src={Pikachu}></img>
			<ul>Ralph</ul>

			<h1 className="text-4xl"><a href="https://www.ssbwiki.com/NorCal_Power_Rankings">Previous PRs</a></h1>
		</div>
	)
}
export default PowerRanking