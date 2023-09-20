import React from "react"
import styled from "styled-components"
import meleeLogo from "../assets/norcal-melee.jpg"


const Header = () => {
	return (
		<Jumbo>
			<h1>Norcal Tournament Listings</h1>
		</Jumbo>
	)
}

const Jumbo = styled.div`
	padding: 16px;
`

export default Header