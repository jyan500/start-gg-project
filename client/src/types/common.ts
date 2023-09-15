export type SinglesParticipant = {
	id: Number
	gamerTag: String		
}

export type DoublesParticipant = {
	id1: Number
	gamerTag1: String
	id2: Number
	gamerTag2: String
}

export type Tournament = {
	id: Number
	name: String
	city: String
	startAt: Date
	url: String
	venueName: String | null
	venueAddress: String | null
	singlesParticipants: Array<SinglesParticipant>
	doublesParticipants: Array<DoublesParticipant>
}
