const mongoose = require("mongoose")

const playerTournamentSchema = new mongoose.Schema({
	playerId: Number,
	tournamentId: Number,
	tournamentName: String,
	eventId: Number,
	startAt: Number
})

const PlayerTournament = mongoose.model("PlayerTournament", playerTournamentSchema)

module.exports = PlayerTournament