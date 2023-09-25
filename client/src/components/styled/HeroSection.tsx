import styled from "styled-components"

const HeroSection = styled.section<{imgUrl: string, backgroundPosition: string}>`
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to bottom, #0a0c2c80 3rem, transparent 10rem), ${(props) => `url(${props.imgUrl})`};
	background-size: cover;
	background-position: ${(props) => props.backgroundPosition};
	height: 48vh;
`

export default HeroSection
