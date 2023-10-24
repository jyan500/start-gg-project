const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema({
	playerId: Number,
	userId: Number,
	gamerTag: String,	
})

const Player = mongoose.model("Player", playerSchema)

module.exports = Player