import React, {useState} from "react"
import PlayerBanner from "../../assets/bay-area-mini.jpeg"
import HeroSection from "../styled/HeroSection"
import SearchBar from "../styled/SearchBar"
import api from "../../config/api"
import { Player, Set } from "../../types/common"
import { ReactSearchAutocomplete } from "react-search-autocomplete" 
import { MdKeyboardArrowLeft as ArrowLeft, MdKeyboardArrowRight as ArrowRight } from "react-icons/md"

type TournamentSetResponse = {
	tournament: string
	date: Date
	numEntrants: number
	placement: number
	sets: Array<Set>
}

const PlayerDatabase = () => {
	const [players, setPlayers] = useState<Array<Player>>([])
	const [currentPlayer, setCurrentPlayer] = useState<Player>()
	const [tournamentSets, setTournamentSets] = useState<Array<TournamentSetResponse>>([]) 
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	const onSearch = async (val: string) => {
		console.log("val: ", val)
		const res = await api.get(`/players?tag=${val}`)
		setPlayers(res.data)
	}
	const onSelect = async (p: any) => {
		console.log("p: ", p)
		setCurrentPlayer(p)
		const res = await api.get(`/players/${p.userId}`)
		setTournamentSets(res.data.results)
		setCurrentPage(res.data.currentPage)
		setTotalPages(res.data.totalPages)
	}

	const onPrev = async () => {
		if (currentPlayer){
			const res = await api.get(`/players/${currentPlayer.userId}?currentPage=${currentPage-1}&totalPages=${totalPages}`)
			setTournamentSets(res.data.results)
			setCurrentPage(res.data.currentPage)
			setTotalPages(res.data.totalPages)
		}
	}

	const onNext = async () => {
		if (currentPlayer){
			const res = await api.get(`/players/${currentPlayer.userId}?currentPage=${currentPage+1}&totalPages=${totalPages}`)
			setTournamentSets(res.data.results)
			setCurrentPage(res.data.currentPage)
			setTotalPages(res.data.totalPages)
		}
	}

	return (
		<div>
			<HeroSection  imgUrl={PlayerBanner} backgroundPosition="top">
				<h1 className = "text-6xl font-bold" style={{color: "white"}}>Players</h1>
			</HeroSection>
			<div className = "flex flex-col justify-center items-center p-8">
				<div className = "text-center">
					<h1 className = "text-6xl">Norcal Player Database</h1>
				</div>
				<div className = "text-center p-8">
					<p className = "border p-4 font-bold">Due to data size limitations, this database will only show players that have attended a norcal tournament within the current year</p>
					<div className = "flex items-center justify-between p-8">
						<div className = "w-1/2">
							<ReactSearchAutocomplete 
								items={players} 
								onSelect={onSelect} 
								onSearch={onSearch} 
								fuseOptions={{keys: ["gamerTag"]}} 
								resultStringKeyName={"gamerTag"}
								styling ={
									{ 
										borderRadius: "4px",
										boxShadow: "rgba(32, 33, 36, .28) 0px 1px 2px 0px"
									}
								}
							/>
						</div>
						<div className = "w-1/2">Advanced Filters Go Here</div>
					</div>
				</div>
			</div>
			{
				tournamentSets.length ? (<div className = "pb-8 pl-8 pr-8">
					<div className = "flex flex-row p-4">
						<div className = "flex-1 p-8">
							<h1 className = "border p-4 font-bold text-center">Tournaments</h1>
							<div className = "font-medium flex flex-row p-2 border">
								<div className = "w-1/5">Date</div>
								<div className = "flex-1">Name</div>
								<div>Placing</div>
							</div>
							{tournamentSets.map((tournament) => {
								return (
									<div className = "font-medium flex flex-row p-2 border">
										<div className = "w-1/5">
											{new Date(tournament.date).toLocaleDateString()}
										</div>
										<div className = "flex-1">{tournament.tournament}</div>
										<div><span className = "font-bold">{tournament.placement}</span> / {tournament.numEntrants}</div>
										
									</div>
								)
							})}
							<div className = "flex justify-between mt-4">
								{ 
									currentPage > 1 ? ( 
									<button className = "p-4" onClick={onPrev}><ArrowLeft/><span>Previous</span></button>) : <div></div>
								}
								{
									currentPage <= totalPages && (
										<button className = "p-4" onClick={onNext}><ArrowRight/><span>Next</span></button>
									)
								}
							</div>
						</div>
						<div className = "flex-1 p-8">
							<h1 className = "border p-4 font-bold text-center">Sets</h1>
							{
								tournamentSets.map((tournament) => {
									return (
										<div className = "text-center">
											<div className = "mt-4 mb-4">
												<h1 className = "font-bold">{tournament.tournament}</h1>
											</div>
											<div className = "font-medium flex flex-row p-2 border">
												<div className = "w-1/3">Round</div>
												<div className = "w-1/3">Opponent</div>
												<div className = "w-1/3">Score</div>
											</div>
											{tournament.sets.map((set) => {
												const player = set.player1.playerId === currentPlayer?.id ? set.player1 : set.player2
												const opponent = set.player1.playerId === currentPlayer?.id ? set.player2 : set.player1
												const winner = set.winner === set.player1.entrantId ? set.player1 : set.player2
												const isDQ = player.score === -1 || opponent.score === -1
												const noScoreReported = player.score == null || opponent.score == null
												const score = !noScoreReported ? `${player.score} - ${opponent.score}` : (winner.playerId === player.playerId) ? "WIN" : "LOSS" 
												return (
													<div className = {`font-medium flex flex-row p-2 border ${winner.playerId === player.playerId ? "bg-green-500" : "bg-red-500"}`}>
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
				</div>) : null
			}
		</div>
	)
}

export default PlayerDatabase