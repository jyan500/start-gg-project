import React, { useState } from "react"
import { Link, PathMatch } from "react-router-dom"
import { MdKeyboardArrowDown as ArrowDown, MdKeyboardArrowUp as ArrowUp } from "react-icons/md"

type SubMenu = {
	text: string
	url: string
	isActive: PathMatch<string>|null
}

type SubMenuData = {
	text: string
	subMenus: Array<SubMenu>
}

type SubMenuProps = {
	data: SubMenuData
}

const SubMenu = (props: SubMenuProps) => {
	const [ subMenuOpen, setSubMenuOpen ] = useState(false)

	const onClick = () => {
		setSubMenuOpen(!subMenuOpen)
	}

	return (
		<ul>
			<li onClick = {onClick} className = {`text-white text-sm flex justify-between text-center gap-x-4 p-2 hover:bg-slate-900`}>
				<p>{props.data.text}</p> {subMenuOpen ? <ArrowUp/> : <ArrowDown/>}
			</li>	

			<ul className = {subMenuOpen ? "visible" : "invisible"}>
				{
					props.data.subMenus.map((menu) => {
						return (
							<Link to = {menu.url}><li className = {`text-white text-sm flex text-center items-center gap-x-4 p-2 hover:bg-slate-900 ${menu.isActive ? "bg-slate-900" : ""}`}>{menu.text}</li></Link>
						)	
					})

				}
			</ul>
		</ul>
	)
}

export default SubMenu