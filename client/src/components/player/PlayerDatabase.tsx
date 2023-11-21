import React, {useEffect, useState} from "react"
import PlayerBanner from "../../assets/bay-area-mini.jpeg"
import HeroSection from "../styled/HeroSection"
import LoadingSpinner from "../styled/LoadingSpinner"
import api from "../../config/api"
import { Player, Set } from "../../types/common"
import { ReactSearchAutocomplete } from "react-search-autocomplete" 
import { MdOutlineWifi as OnlineIcon } from "react-icons/md";

type tResponse = {
	event: TournamentResponse
	sets: Array<SetResponse>
}

type TournamentResponse = {
	id: number
	tournament: string
	tournamentId: string 
	startAt: Date
	numEntrants: number
	placement: number
	isOnline: boolean
}

type SetResponse = {
	winner: number
	displayScore: string
	round: string	
	player1: PlayerResponse
	player2: PlayerResponse
}

type PlayerResponse = {
	score: number
	entrantId: number
	gamerTag: string
	playerId: number
}

const PlayerDatabase = () => {
	const [players, setPlayers] = useState<Array<Player>>([])
	const [currentPlayer, setCurrentPlayer] = useState<Player>()
	const [tournaments, setTournaments] = useState<Array<tResponse>>([]) 
	const [loading, setLoading] = useState(false)
	const [nextCursor, setNextCursor] = useState()

	const [firstElementId, setFirstElementId] = useState("")
	const [urlString, setUrlString] = useState("")
	const [form, setForm] = useState<Record<string, any>>({"onOrOffline": "All"})

	// when the next set of elements loads in via the API,
	// scroll to the first element that was added
	useEffect(() => {
	    const element = document.getElementById(firstElementId)
	    if (element)
	        element.scrollIntoView({ behavior: 'smooth' })
	}, [firstElementId])

	const onSearch = async (val: string) => {
		const res = await api.get(`/players?tag=${val}`)
		setPlayers(res.data)
	}
	const onSelect = async (p: any) => {
		setLoading(true)
		const res = await api.get(`/players/${p.userId}`)
		setLoading(false)
		setCurrentPlayer(p)
		setTournaments(res.data.results)
		setNextCursor(res.data.nextCursor)
	}

	const onNext = async () => {
		if (currentPlayer){
			setLoading(true)
			const res = await api.get(`/players/${currentPlayer.userId}?cursor=${nextCursor}&isNext=${true}&${urlString}`)
			setLoading(false)
			setTournaments([...tournaments, ...res.data.results])
			if (res.data.results.length){
				setFirstElementId(res.data.results[0].event.id)
			}
			setNextCursor(res.data.nextCursor)
		}
	}

	const onClickSet = (tournamentID: string) => {
		const element = document.getElementById(tournamentID)
		if (element){
			element.scrollIntoView({behavior: "smooth"})
		}
	}

	const onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
		setForm({...form, onOrOffline: (e.target as HTMLInputElement).value})
	}

	const onFormSubmit = async (e: React.FormEvent) => {
		if (currentPlayer){
			e.preventDefault()
			let urlStringParts: string[] = []
			Object.keys(form).forEach((key)=>{
				urlStringParts.push(`${key}=${form[key]}`)
			})
			const curUrlString = urlStringParts.join("&")
			setUrlString(curUrlString)
			setLoading(true)
			console.log("urlString: ", urlString)
			const res = await api.get(`/players/${currentPlayer.userId}?${curUrlString}`)
			setLoading(false)
			setTournaments(res.data.results)
			if (res.data.results.length){
				setFirstElementId(res.data.results[0].event.id)
			}
			setNextCursor(res.data.nextCursor)
		}
	}

	return (
		<div>
			<HeroSection  imgUrl={PlayerBanner} backgroundPosition="top">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Players</h1>
			</HeroSection>
			<div className = "flex flex-col justify-center items-center pt-8 pr-8 pl-8">
				<div className = "text-center">
					<h1 className = "text-6xl">Norcal Player Database</h1>
				</div>
				<div className = "text-center p-8">
					<p className = "border p-4 font-bold">Due to data size limitations, this database will only show players that have attended a norcal tournament within the current year</p>
					<div className = "flex items-center justify-between p-8">
						<div className = "w-1/2 pl-4 pr-4">
							<ReactSearchAutocomplete 
								items={players} 
								onSelect={onSelect} 
								onSearch={onSearch} 
								fuseOptions={{keys: ["gamerTag"]}} 
								resultStringKeyName={"gamerTag"}
								styling ={
									{ 
										borderRadius: "4px",
										boxShadow: "rgba(32, 33, 36, .28) 0px 1px 2px 0px",
										zIndex: 999,
									}
								}
							/>
						</div>
						<div className = {`visibility: ${tournaments.length ? "visible" : "hidden"} w-1/2 pl-2 pr-2`}>
							<form>
								<div className = "flex gap-x-6 flex-row">
									{["Online", "Offline", "All"].map((val) => {
										return (
											<div className = "flex items-center">
												<input onChange = {onValueChange} value = {val} checked = {form.onOrOffline === val} type="radio" name="online" className = "shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"/>
												<label htmlFor = "online" className = "text-sm ms-2">{val}</label>
											</div>
										)
									})}
									<div><button onClick={onFormSubmit}>Submit</button></div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className = {`visibility: ${tournaments.length ? "visible": "hidden"}`}>
				<div className = "pl-8 pr-8">
					<div className = "flex flex-row p-4">
						<div className = "flex-1 pr-8 pl-8">
							<h1 className = "border p-4 font-bold text-center">Tournaments</h1>
							<div className = "font-medium flex flex-row p-2 border">
								<div className = "w-1/4">Date</div>
								<div className = "w-2/4">Name</div>
								<div className = "w-1/4"></div>
								<div className = "w-1/4">Placing</div>
							</div>
							<div style={{maxHeight: 550, overflowY: "scroll"}}>
								{tournaments.map(({event}) => {
									return (
										<div id = {"" + event.id} onClick = {() => onClickSet(event.tournamentId) } className = "cursor-pointer hover:bg-slate-300 font-medium flex flex-row p-2 border">
											<div className = "w-1/4">
												{new Date(event.startAt).toLocaleDateString("en-US")}
											</div>
											<div className = "w-2/4">{event.tournament}</div>
											<div className = "w-1/4 ml-4">{event.isOnline && <OnlineIcon/>}</div>
											<div className = "w-1/4"><span className = "font-bold">{event.placement}</span> / {event.numEntrants}</div>
										</div>
									)
								})}
							</div>
							<div className = "flex justify-between mt-4">
								{
									tournaments.length && nextCursor ? (
										<button className = "p-4" onClick={onNext}><span>Load More Results</span></button>
									) : <div></div>
								}
							</div>
						</div>
						<div className = "flex-1 pr-8 pl-8">
							<h1 className = "border p-4 font-bold text-center">Sets</h1>
							<div style = {{maxHeight: 550, overflowY: "scroll"}}>
								{
									tournaments.map((tournament) => {
										const {event, sets} = tournament
										return (
											<div id = {event.tournamentId} className = "text-center">
												<div className = "mt-4 mb-4">
													<h1 className = "font-bold">{event.tournament}</h1>
												</div>
												<div className = "font-medium flex flex-row p-2 border text-base">
													<div className = "w-1/3">Round</div>
													<div className = "w-1/3">Opponent</div>
													<div className = "w-1/3">Score</div>
												</div>
												{sets.map((set) => {
													const player = set.player1.playerId === currentPlayer?.id ? set.player1 : set.player2
													const opponent = set.player1.playerId === currentPlayer?.id ? set.player2 : set.player1
													const winner = set.winner === set.player1.entrantId ? set.player1 : set.player2
													const isDQ = player.score === -1 || opponent.score === -1
													const noScoreReported = player.score == null || opponent.score == null
													const score = !noScoreReported ? `${player.score} - ${opponent.score}` : (winner.playerId === player.playerId) ? "WIN" : "LOSS" 
													return (
														<div className = {`text-base font-medium flex flex-row p-2 border ${winner.playerId === player.playerId ? "bg-green-500" : "bg-red-500"}`}>
															<div className = "w-1/3"><p>{set.round}</p></div>
															<div className = "w-1/3">
																<p> {opponent.gamerTag} </p>	
															</div>
															<div className = "w-1/3">
																<p>{isDQ ? "DQ" : score}</p>
															</div>
														</div>
													)
												})}
											</div>
										)
									})
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className = "flex flex-col justify-center items-center pb-4">
				<LoadingSpinner loading={loading}/>
			</div>
		</div>
	)
}

export default PlayerDatabase