const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()
const port = 8000

app.use(cors())
app.use(bodyParser.json())

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

const tournamentRoute = require("./routes/tournaments")
app.use("/tournaments", tournamentRoute)

