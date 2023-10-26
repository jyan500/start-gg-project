import React from "react"
import { Tournament } from "../types/common"
import styled from "styled-components"

type Props = {
	tournament: Tournament
}

const TournamentCard = (props: Props) => {
	return (
		<div className = "p-8 flex border items-center">
			<div className = "mr-8">
				<img width="250" height="250" src = {props.tournament.profileImg}/>
			</div>
			<div>
				<p>{props.tournament.name}</p>
				<p>{new Date(props.tournament.startAt).toLocaleString()}</p>
				<p>{props.tournament.venueAddress}</p>
				<a href={`https://start.gg${props.tournament.url}`}>{`https://start.gg${props.tournament.url}`}</a>
				{/*<p>Singles Participants:</p>
				<div>
					{
						props.tournament.singlesParticipants.map((participant, index) => {
							if (index < 20)
								return (
									<p>{participant.gamerTag}</p>
								)
						})
					}
					<p>{props.tournament.singlesParticipants.length > 20 ? "See Start GG Link for full list of participants" : ""} </p>
				</div>*/}
			{/*	<p>Doubles Participants:</p>
				<div>
					{
						props.tournament.doublesParticipants.map((participant) => (
							<p>{`${participant.gamerTag1} - ${participant.gamerTag2}`}</p>
						))
					}
				</div>*/}
			</div>
		</div>
	)
}

const Card = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 4px;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`

export default TournamentCard