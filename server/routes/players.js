const express = require("express")
const axios = require("axios")
const router = express.Router()
const Player = require("../models/Player")
const { getAllPages, getPage } = require("../utils/utils")

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

	/*
	change of plans:
	have to use query1 below here to grab all sets for the player because it's not reliable
	to grab the sets through the user (because sometimes the user doesn't get connected as an entrant to the event)

	Through the sets, grab the singles events based on the ID, and then through another query, get the placements, 
	num entrants for that tournament
	*/
// 	const query1 = `
// 	query Sets ($playerId: ID!, $timestamp: Timestamp){
//   player(id: $playerId) {
//     id
//     sets(perPage: 200, page: 1, filters: {updatedAfter: $timestamp}) {
//     	pageInfo {
// 		  	totalPages
// 		  	page
// 	  	}
//       nodes {
//         id
//         event {
//           id
//           name
//           videogame {
//           	id
//           }
//           type 
//           numEntrants
//           startAt
//           tournament {
//             id
//             name
//           }
//         }
//       }
//     }
//   }
// }
// 	`
		const query1 = `
	query Sets ($playerId: ID!, $timestamp: Timestamp){
  player(id: $playerId) {
    id
    sets(perPage: 200, page: 1, filters: {updatedAfter: $timestamp}) {
    	pageInfo {
		  	totalPages
		  	page
	  	}
      nodes {
        id
        winnerId
        displayScore
        fullRoundText
        event {
          id
          name
          videogame {
          	id
          }
          type 
          numEntrants
          startAt
          tournament {
            id
            name
          }
        }
        slots {
          id
          entrant {
            id 
            name
            standing {
              placement
            }
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
	`
	// get sets for a specific tournament
	const query2 = 
`	
query PlayerSets($playerId: ID!, $tournamentId: ID!){
  	tournament(id: $tournamentId) {
    	events(filter: {videogameId: 1, type: 1}){  
      sets (
        sortType: RECENT
        filters: {
          playerIds: [$playerId]
        }
      ) {
        pageInfo {
          totalPages
          page
        }
        nodes {
          id
          winnerId
          displayScore
          fullRoundText
          event {
          	id 
          }
          slots {
            id
            entrant {
              id 
              name
              standing {
                placement
              }
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
}`
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
	const d = new Date()
	d.setYear(d.getFullYear() - 1)
	console.log("d: ", Math.ceil(d / 1000))
	const variables = {
		"page": 1,
		"userId":userId, 
		"playerId":player.playerId,
		// "timestamp": Math.ceil(d / 1000) // unix timestamp from two years ago
		"timestamp": 1681776000 // 
	}

	// const [results, currentPageParam, totalPagesParam] = await getPage(query, variables, ["user", "events"], currentPage, totalPages)
	const results = await getAllPages(query1, variables, ["player", "sets"])
	let mapped = results.reduce((acc, res) => {
		if (res.event.videogame.id === 1 && res.event.type === 1){
			if (!(res.event.tournament.id in acc)){
				acc[res.event.tournament.id] = {"sets": [], "event": {}}
			}
			const [player1, player2] = res.slots
	    const placement = player1.entrant.participants[0].player.id === player.playerId ? player1.entrant.standing.placement : player2.entrant.standing.placement
			const set = {
					"winner": res.winnerId,
					"displayScore": res.displayScore,
					"round": res.fullRoundText,
					"player1": {"score": player1.standing.stats.score.value, "entrantId": player1.entrant.id, "gamerTag": player1.entrant.participants[0].player.gamerTag, "playerId": player1.entrant.participants[0].player.id},
					"player2": {"score": player2.standing.stats.score.value, "entrantId": player2.entrant.id, "gamerTag": player2.entrant.participants[0].player.gamerTag, "playerId": player2.entrant.participants[0].player.id}
			}
			// add new sets to the front of the array since the sets are in most recent order (rather than the order at which they were played)
			acc[res.event.tournament.id]["sets"].unshift(set)
			acc[res.event.tournament.id]["event"] = {
				id: res.event.id,
				tournament: res.event.tournament.name, 
				tournamentId: res.event.tournament.id,
				numEntrants: res.event.numEntrants,
				placement: placement, 
				startAt: new Date(res.event.startAt * 1000)}
		}
		return acc
	}, {})
	mapped = Object.values(mapped).sort((res) => res.event.startAt).reverse()
	// const eventIdSet = new Set() 
	// const meleeSinglesEvents = []
	// results.forEach((result) => {
	// 	const event = result.event
	// 	if (!eventIdSet.has(event.id)){
	// 		meleeSinglesEvents.push({
	// 			"tournamentId": event.tournament.id,
	// 			"tournament": event.tournament,
	// 			"eventId": event.id,
	// 			"numEntrants": event.numEntrants,
	// 			"startAt": event.startAt,
	// 		})
	// 		eventIdSet.add(result.event.id)
	// 	}
	// })
	// console.log("*********** events *************")
	// console.log(JSON.stringify(meleeSinglesEvents))
	
	// const setsByTournament = await Promise.all(meleeSinglesEvents.map(async (event) => {
	// 	const variables2 = {
	// 		playerId: player.playerId,
	// 		tournamentId: event.tournamentId, 
	// 	}
	// 	const results2 = await getAllPages(query2, variables2, ["tournament", "events", "sets"])
	// 	return results2.reduce((acc, result) => {
	// 		const [player1, player2] = result.slots
	// 		const set = {
	// 				"winner": result.winnerId,
	// 				"displayScore": result.displayScore,
	// 				"round": result.fullRoundText,
	// 				"player1": {"score": player1.standing.stats.score.value, "entrantId": player1.entrant.id, "gamerTag": player1.entrant.participants[0].player.gamerTag, "playerId": player1.entrant.participants[0].player.id},
	// 				"player2": {"score": player2.standing.stats.score.value, "entrantId": player2.entrant.id, "gamerTag": player2.entrant.participants[0].player.gamerTag, "playerId": player2.entrant.participants[0].player.id}
	// 		}
	// 		acc["placement"] = player1.entrant.participants[0].player.id === player.playerId ? player1.entrant.standing.placement : player2.entrant.standing.placement
	// 		acc["eventId"] = result.event.id
	// 		acc["sets"].push(set)
	// 		return acc
	// 	}, {placement: null, eventId: null, sets: []})
	// }))
	// console.log("setsByTournament: ", setsByTournament)


	// const mapped = results.map((result) => {
	// 	const tournament = result.tournament.name
	// 	const timestamp = result.startAt
	// 	const numEntrants = result.numEntrants
	// 	// we need to reverse it due to start gg's order going from 
	// 	// most recent set played
	// 	const sets = result.sets.nodes.toReversed().map((set) => {
	// 		const [player1, player2] = set.slots
	// 		return {
	// 			"winner": set.winnerId,
	// 			"displayScore": set.displayScore,
	// 			"round": set.fullRoundText,
	// 			"player1": {"score": player1.standing.stats.score.value, "entrantId": player1.entrant.id, "gamerTag": player1.entrant.participants[0].player.gamerTag, "playerId": player1.entrant.participants[0].player.id},
	// 			"player2": {"score": player2.standing.stats.score.value, "entrantId": player2.entrant.id, "gamerTag": player2.entrant.participants[0].player.gamerTag, "playerId": player2.entrant.participants[0].player.id}
	// 		}
	// 	})
	// 	return {
	// 		"tournament": tournament,
	// 		"tournamentID": result.tournament.id,
	// 		"numEntrants": numEntrants,
	// 		"placement": result.userEntrant?.standing?.placement,
	// 		"date": new Date(timestamp * 1000),
	// 		"sets": sets,
	// 	}
	// })

	// const mappedResults = {"results": mapped, "currentPage": currentPageParam, "nextPage": currentPageParam + 1, "totalPages": totalPagesParam}
	// res.json(mappedResults)
  // const mappedResults = {
  // 	"tournaments": tournaments, 
  // 	// "setsByTournament": setsByTournament, 
  // 	"currentPage": currentPageParam, 
  // 	"nextPage": currentPageParam + 1, 
  // 	"totalPages": totalPagesParam
  // }

  // res.json(mappedResults)
  res.json({"results": mapped})
})

module.exports = router