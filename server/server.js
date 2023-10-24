const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()
const port = 8000

app.use(cors())
app.use(bodyParser.json())

mongoose.connect("mongodb://localhost/start-gg-project", {
	useNewUrlParser: true,	
	useUnifiedTopology: true,
})

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB")
})


app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

const tournamentRoute = require("./routes/tournaments")
const playerRoute = require("./routes/players")
app.use("/tournaments", tournamentRoute)
app.use("/players", playerRoute)

