const { makePaginatedCall } = require("../utils/utils")
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
	"afterDate": 1697155200 // one week ago // 1689638400 // 3 months ago // 1681776000 // 6 months ago in unix timestamp
}


const populateDB = async (query, variables) => {
	const players = {}
	const results = await makePaginatedCall(query, variables, ["tournaments"])
	results.map((tournament, index) => {
		const singlesEntrants = tournament.events[0].entrants.nodes
		singlesEntrants.map((participant) => {
			const p = participant.participants[0]
			if (p.player?.user){
				players[p.player.user.id] = {
					playerId: p.id,	
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
	// console.log(JSON.stringify(allPlayers))
	// const newPlayer = new Player({
	// 	userId: allPlayers[0].userId,
	// 	gamerTag: allPlayers[0].gamerTag,
	// 	playerId: allPlayers[0].playerId,
	// })
	// const res = await Player.find({userId: allPlayers[0].userId})
	// console.log("was player found: ", res)
	// if (!res.length){
	// 	const result = await newPlayer.save()
	// 	console.log("result: ", result)
	// }

	// uncomment below to clean database
	// await Player.deleteMany({})

	// find	
	const sampleId = allPlayers[0].userId
	const res = await Player.find({userId: sampleId})

	// // deletes all for now

	// connect to the DB
	// mongoose.connect("mongodb://localhost/start-gg-project")
	const mapped = allPlayers.map((player) => {
		return {
			updateOne: {
				filter: {userId: player.userId},
				update: player,
				upsert: true
			}
		}
	})
	console.log(JSON.stringify(mapped))
	try {
		await Player.bulkWrite(mapped)
	}
	catch (error){
		console.log(error)
	}

	// find	
	const res2 = await Player.find({userId: sampleId})

	// deletes all for now
	// await Player.deleteMany({})


}

populateDB(query, variables).then(() => {
	process.exit(1)
})




