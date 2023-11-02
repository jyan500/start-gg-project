const { getAllPages } = require("../utils/utils")
const axios = require("axios")
const Player = require("../models/Player")
const mongoose = require("mongoose")
require("dotenv").config({ path: "../.env"})

const query = `
query NorcalMeleeTournaments($perPage: Int, $page: Int, $afterDate: Timestamp, $coordinates: String!, $radius: String!, $videogameId: ID!) {
  tournaments(query: {
    page: $page,
    perPage: $perPage, 
    filter: {
      location: {
        distanceFrom: $coordinates,
        distance: $radius
      },
      afterDate: $afterDate,
      videogameIds: [
        $videogameId
      ]
    }
  }) {
  	pageInfo {
  		totalPages
  		page
  	}
    nodes {
      id
      name
      events(filter: {
        videogameId: 1,
        type: 1 
      }){
        id
        name
        entrants{
          nodes {
            participants {
            	id
              gamerTag
              player {
              	id
              	user {
              		id
              	}
              }
            }
          }
        }
    	}
    }
  }
},
`

const variables = {
	"page": 1,
	"videogameId":1,
	"perPage": 10,
	"coordinates": "37.7749, -122.4194",
	"radius": "100mi",
	// 1697155200 // one week ago // 1689638400 // 3 months ago // 1681776000 // 6 months ago in unix timestamp
	"afterDate": 1681776000
}


const populateDB = async (query, variables) => {
	const players = {}
	const results = await getAllPages(query, variables, ["tournaments"])
	results.map((tournament, index) => {
		const singlesEntrants = tournament.events[0].entrants.nodes
		singlesEntrants.map((participant) => {
			const p = participant.participants[0]
			if (p.player?.user){
				players[p.player.user.id] = {
					playerId: p.player.id,	
					gamerTag: p.gamerTag,
					userId: p.player.user.id
				}
			}
		})
	})	

	mongoose.connect('mongodb://localhost/start-gg-project', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoose.connection.on("connected", () => {
		console.log("Connected to mongo db")
	})

	const allPlayers = Object.values(players)
	// uncomment below to clean database
	await Player.deleteMany({})

	// find	
	const sampleId = allPlayers[0].userId
	const res = await Player.find({userId: sampleId})

	// connect to the DB
	const mapped = allPlayers.map((player) => {
		return {
			updateOne: {
				filter: {userId: player.userId},
				update: player,
				upsert: true
			}
		}
	})
	try {
		await Player.bulkWrite(mapped)
	}
	catch (error){
		console.log(error)
	}

	const res2 = await Player.find({userId: sampleId})

}

populateDB(query, variables).then(() => {
	process.exit(1)
})




