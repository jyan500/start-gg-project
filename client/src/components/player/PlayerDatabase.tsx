import React, {useState} from "react"
import PlayerBanner from "../../assets/bay-area-mini.jpeg"
import HeroSection from "../styled/HeroSection"
import SearchBar from "../styled/SearchBar"
import api from "../../config/api"
import { Player } from "../../types/common"

const PlayerDatabase = () => {
	const [players, setPlayers] = useState<Array<Player>>([])
	const onSubmit = async (val: string) => {
		const res = await api.get(`/players?tag=${val}`)
		setPlayers(res.data)
	}
	const onClick = async (userId: number) => {
		const res = await api.get(`/players/${userId}`)
	}
	return (
		<div>
			<HeroSection  imgUrl={PlayerBanner} backgroundPosition="top">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Players</h1>
			</HeroSection>
			<div className = "flex-col justify-center items-center p-8">
				<div className = "text-center">
					<h1 className = "text-6xl">Norcal Player Database</h1>
				</div>
				<div className = "text-center">
					<p>Due to data size limitations, this database will only show players that have attended a norcal tournament within the current year</p>
					<div className = "flex items-center justify-between">
						<div className = "w-1/2">
							<SearchBar onSubmit = {onSubmit}/>
						</div>
						<div className = "w-1/2">Advanced Filters Go Here</div>
					</div>
					<div className = "flex-col">
						{players.map((p) => (<div><button onClick = {() => onClick(p.userId)} className = "p-1 hover:bg-sky-200">{p.gamerTag}</button></div>))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PlayerDatabase