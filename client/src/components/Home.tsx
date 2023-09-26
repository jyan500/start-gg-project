import React from "react"
import HeroSection from "./styled/HeroSection"
import Banner from "../assets/norcal-melee-banner.jpeg"

const Home = () => {
	return (
		<div>
			<HeroSection imgUrl={Banner} backgroundPosition="center"></HeroSection>

		</div>
	)
}

export default Home