const express = require("express")
const axios = require("axios")
const router = express.Router()
const Player = require("../models/Player")
const { getPage } = require("../utils/utils")

router.get("/", async (req, res) => {
	const gamerTag = req.query.tag
	// get all players where tag in their gamerTag string
	try {
		const players = await Player.find({"gamerTag": { "$regex": gamerTag, "$options": "i"}}, { _id: 0}).sort({"gamerTag": 1})
		console.log(JSON.stringify(players))
		res.json(players)	
	}
	catch (error) {
		res.json(error)
	}
})

router.get("/:id", async (req, res) => {	
	const userId = req.params.id
	const currentPage = req.query?.currentPage ?? 1 
	const totalPages = req.query?.totalPages ?? 1
	const player = await Player.findOne({"userId": userId})
	// melee singles sets from player 
	const query = 
	`
	query User($page: Int, $userId: ID!, $playerId: ID!){
    user(id: $userId){
      id
      name
      events(query: {
        page: $page,
        perPage: 6,
        sortBy: "startAt desc",
        filter: {
          videogameId: 1,
          eventType: 1
        }
      }){
      	pageInfo {
		  		totalPages
		  		page
		  	}
        nodes {
          id 
          name
          startAt
          tournament {
            name
          }
          sets(
            page: 1,
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
	const variables = {
		"page": 1,
		"userId":userId, 
		"playerId":player.playerId 
	}

	const [result, currentPageParam, totalPagesParam] = await getPage(query, variables, ["user", "events"], currentPage, totalPages)
	console.log(JSON.stringify(result))

	


	res.json("hello")
})

module.exports = router