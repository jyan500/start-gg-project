export type SinglesParticipant = {
	id: number
	gamerTag: string		
}

export type DoublesParticipant = {
	id1: number
	gamerTag1: string
	id2: number
	gamerTag2: string
}

export type Tournament = {
	id: number
	name: string
	city: string
	profileImg: string
	startAt: Date
	url: string
	venueName: string | null
	venueAddress: string | null
	singlesParticipants: Array<SinglesParticipant>
	doublesParticipants: Array<DoublesParticipant>
}

export type Player = {
	userId: number	
	playerId: number
	gamerTag: string
}
