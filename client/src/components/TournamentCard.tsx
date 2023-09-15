import React from "react"
import { Tournament } from "../types/common"
import styled from "styled-components"

type Props = {
	tournament: Tournament
}

const TournamentCard = (props: Props) => {
	return (
		<Card>
			<p>{props.tournament.name}</p>
			<p>{new Date(props.tournament.startAt).toLocaleString()}</p>
			<p>{props.tournament.venueAddress}</p>
			<a href={`https://start.gg${props.tournament.url}`}>{`https://start.gg${props.tournament.url}`}</a>
			<p>Singles Participants:</p>
			<div>
				{
					props.tournament.singlesParticipants.map((participant) => (
						<p>{participant.gamerTag}</p>
					))
				}
			</div>
			<p>Doubles Participants:</p>
			<div>
				{
					props.tournament.doublesParticipants.map((participant) => (
						<p>{`${participant.gamerTag1} - ${participant.gamerTag2}`}</p>
					))
				}
			</div>
		</Card>
	)
}

const Card = styled.div`
	padding: 4px;
	border: 1px solid 
`

export default TournamentCard