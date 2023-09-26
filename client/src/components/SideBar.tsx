import React from "react"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import meleeLogo from "../assets/norcal-melee-new-profile.jpeg"
import styled from "styled-components"
import SubMenu from "./SubMenu"


const SideBar = () => {
	const menu = [{
		text: "Home", url: "/", isActive: useMatch({path: useResolvedPath("/").pathname, end: true}),
	},{
		text: "Tournaments", url: "/tournaments", isActive: useMatch({path: useResolvedPath("/tournaments").pathname, end:true}),
	},{
		text: "Players",
		subMenus: [{
			text: "Power Ranking",
			url: "/players/power-ranking",
			isActive: useMatch({path: useResolvedPath("/players/power-ranking").pathname, end: true}),
		},
		{
			text: "Database",
			url: "/players/database",
			isActive: useMatch({path: useResolvedPath("/players/database").pathname, end: true}),
		}]
	}]
	return (
		<div className = "w-48 h-screen bg-black">
			<img width="180" height="180" src={meleeLogo}/>
			<ul className = "pt-6">
				{
					menu.map((m, index) => {
						if (m.subMenus){
							return (
								<SubMenu key = {index} data = {m}></SubMenu>
							)
						}
						else {
							return (
								<Link className = "link" to={m.url}><li key = {index} className = {`text-white text-sm flex text-center items-center gap-x-4 p-2 hover:bg-slate-900 ${m.isActive ? "bg-slate-900" : ""}`}>{m.text}</li></Link>
							)
						}
					})
				}
			</ul>
		</div>
	)
}

const SideNav = styled.nav`
	display: flex;
	flex-direction: column;
	background-color: "black";
	.link {
		padding: 4px;
		font-size: 16px;
		color: white;
		text-decoration: none;
	}
`

export default SideBar