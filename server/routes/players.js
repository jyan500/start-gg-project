const express = require("express")
const axios = require("axios")
const router = express.Router()
const Player = require("../models/Player")
const { getPage } = require("../utils/utils")

router.get("/", async (req, res) => {
	const gamerTag = req.query.tag
	// get all players where tag in their gamerTag string
	if (gamerTag){
		try {
			const players = await Player.find({"gamerTag": { "$regex": gamerTag, "$options": "i"}}, { _id: 0}).sort({"gamerTag": 1})
			const mapped = players.map((p) => ({...p.toObject(), id: p.playerId}))
			res.json(mapped)	
		}
		catch (error) {
			res.json(error)
		}
	}
	else {
		res.json([])	
	}
})

router.get("/:id", async (req, res) => {	
	const userId = req.params.id
	const currentPage = parseInt(req.query?.currentPage) ?? 1 
	const totalPages = parseInt(req.query?.totalPages) ?? 1
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
          numEntrants
          tournament {
            id
            name
          }
          userEntrant (userId: $userId) {
          	standing {
          		placement
          	}
          }
          sets(
            page: 1,
        		perPage: 10,
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

	const [results, currentPageParam, totalPagesParam] = await getPage(query, variables, ["user", "events"], currentPage, totalPages)
	// console.log(JSON.stringify(results))

	const mapped = results.map((result) => {
		const tournament = result.tournament.name
		const timestamp = result.startAt
		const numEntrants = result.numEntrants
		// we need to reverse it due to start gg's order going from 
		// most recent set played
		const sets = result.sets.nodes.toReversed().map((set) => {
			const [player1, player2] = set.slots
			return {
				"winner": set.winnerId,
				"displayScore": set.displayScore,
				"round": set.fullRoundText,
				"player1": {"score": player1.standing.stats.score.value, "entrantId": player1.entrant.id, "gamerTag": player1.entrant.participants[0].player.gamerTag, "playerId": player1.entrant.participants[0].player.id},
				"player2": {"score": player2.standing.stats.score.value, "entrantId": player2.entrant.id, "gamerTag": player2.entrant.participants[0].player.gamerTag, "playerId": player2.entrant.participants[0].player.id}
			}
		})
		return {
			"tournament": tournament,
			"tournamentID": result.tournament.id,
			"numEntrants": numEntrants,
			"placement": result.userEntrant?.standing?.placement,
			"date": new Date(timestamp * 1000),
			"sets": sets,
		}
	})

	const mappedResults = {"results": mapped, "currentPage": currentPageParam, "nextPage": currentPageParam + 1, "totalPages": totalPagesParam}
	res.json(mappedResults)
})

module.exports = router