import React from "react"
import styled from "styled-components"
import meleeLogo from "../assets/norcal-melee.jpg"


const Header = () => {
	return (
		<Jumbo>
			<h1>Norcal Tournament Listings</h1>
			<img style={{borderRadius: "50%"}} width="180" height="180" src={meleeLogo}/>
		</Jumbo>
	)
}

const Jumbo = styled.div`
	padding: 16px;
`

export default Header