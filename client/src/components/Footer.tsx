import React from "react"
import { SocialIcon } from "react-social-icons"

const Footer = () => {
	return (
		<div>
			<p className = "text-center">All information courtesy of start.gg, official norcal melee twitter</p>
			<div className = "flex justify-center items-center p-4">
				<SocialIcon className = "m-2" url = "https://discord.com/invite/FqhuwFTs67"/>
				<SocialIcon className = "m-2" url = "https://twitter.com/NorCalMelee"/>
				<SocialIcon className = "m-2" url = "https://www.twitch.tv/NorcalMelee"/>
				<SocialIcon className = "m-2" url = "https://www.youtube.com/c/NorCalMelee"/>
				<SocialIcon className = "m-2" url = "https://www.facebook.com/groups/OfficialNorCalMelee"/>
			</div>
		</div>
	)
}

export default Footer