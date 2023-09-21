import React from "react"
import { Link } from "react-router-dom"
import meleeLogo from "../assets/norcal-melee.jpg"

const SideBar = () => {
	return (
		<div>
			<img width="180" height="180" src={meleeLogo}/>
			<div>
				<nav>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/tournaments">Tournaments</Link></li>
						<li><Link to="/players">Players</Link></li>
					</ul>
				</nav>
			</div>
		</div>
	)
}

export default SideBar