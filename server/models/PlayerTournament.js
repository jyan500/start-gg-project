const mongoose = require("mongoose")

const playerTournamentSchema = new mongoose.Schema({
	playerId: Number,
	tournamentId: Number,
	tournamentName: String,
	eventId: Number,
	startAt: Number,
	numEntrants: Number,
	isOnline: Boolean,
})

const PlayerTournament = mongoose.model("PlayerTournament", playerTournamentSchema)

module.exports = PlayerTournament