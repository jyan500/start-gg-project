const express = require("express")
const axios = require("axios")
const router = express.Router()
const Player = require("../models/Player")

router.get("/", async (req, res) => {
	const gamerTag = req.query.tag
	// get all players where tag in their gamerTag string
	try {
		// const players = await Player.find({"gamerTag": "/.*cardsng.*/i"})
		const players = await Player.find({"gamerTag": { "$regex": gamerTag, "$options": "i"}}, { _id: 0})
		// console.log(JSON.stringify(players.toJSON()))
		console.log("players: ", players)
		res.json(players)	
	}
	catch (error) {
		res.json(error)
	}
})

router.get("/:id", (req, res) => {	
	const userId = req.params.id
	const meleeSingleSetsFromEventsEnteredByUser = 
	`
	query User($userId: ID!, $playerId: ID!){
    user(id: $userId){
      id
      name
      events(query: {
        page: 4,
        perPage: 1,
        sortBy: "startAt desc",
        filter: {
          videogameId: 1,
          eventType: 1
        }
      }){
        nodes {
          id 
          name
          startAt
          tournament {
            name
            
          }
          sets(
            page:1,
        		perPage: 20,
            sortType: RECENT,
            filters: {
              playerIds: [$playerId]
            }){
            nodes {     
              id
              winnerId
              displayScore
              fullRoundText
              slots {
                id 
                entrant {
                  id
                  name
                  participants {
                    player {
                      id
                      gamerTag
                    }
                  }
                }
                standing {
                  stats {
                    score {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}
`
	res.json("hello")
})

module.exports = router