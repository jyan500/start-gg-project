const express = require("express")
const axios = require("axios")
const router = express.Router()
const Player = require("../models/Player")
const PlayerTournament = require("../models/PlayerTournament")
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
		const players = await Player.find().sort({"gamerTag": 1})
		const mapped = players.map((p) => ({...p.toObject(), id: p.playerId}))
		res.json(mapped)	
	}
})

router.get("/:id", async (req, res) => {	
	const userId = req.params.id
	// const currentPage = parseInt(req.query?.currentPage) != NaN ? parseInt(req.query?.currentPage) : 1 
	const paginationCursor = req.query?.cursor
	const onOrOffline = req.query?.onOrOffline
	const considerOnline = onOrOffline === "Online" || onOrOffline === "Offline"
	const limit = 10 
	const player = await Player.findOne({"userId": userId})
	// using the unix timestamp as a unique cursor
	const playerTournaments = await PlayerTournament.find(
		{
			"playerId": player.playerId, 
			...(considerOnline ? {isOnline: onOrOffline === "Online"} : {}),
		  ...(paginationCursor ? {"startAt": {$lt: paginationCursor}} : {}),
		}
	).sort({"startAt": -1}).limit(limit + 1)
	// console.log("playerTournaments: ", playerTournaments)
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
// 		const query1 = `
// 	query Sets ($playerId: ID!, $page: Int){
//   player(id: $playerId) {
//     id
//     sets(perPage: 30, page: $page) {
//     	pageInfo {
// 		  	totalPages
// 		  	page
// 	  	}
//       nodes {
//         id
//         winnerId
//         displayScore
//         fullRoundText
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
//         slots {
//           id
//           entrant {
//             id 
//             name
//             standing {
//               placement
//             }
//             participants {
//               player {
//                 id
//                 gamerTag
//               }
//             }
//           }
//           standing {
//             stats {
//               score {
//                 value
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// 	`
		const query1 = `
	query Sets ($playerId: ID!, $page: Int){
  player(id: $playerId) {
    sets(perPage: 400, page: $page) {
    	pageInfo {
		  	totalPages
		  	page
	  	}
      nodes {
        id
        event {
        	tournament {
        		id
        		name
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
	query PlayerSets($playerId: ID!, $tournamentId: ID!, $eventId: ID!){
	  	tournament(id: $tournamentId) {
	    	events(filter: {id: $eventId}){  
	    		numEntrants
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

	// currently unused, due to the issue of it missing tournaments
  // where the player registers locally and not on start.gg
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


	// const d = new Date()
	// get all sets from 6 months ago
	// d.setMonth(d.getMonth() - (1 * currentPage))
	// console.log("player.playerId: ", player.playerId)
	// const variables = {
	// 	"page": 1,
	// 	"userId":userId, 
	// 	"playerId":player.playerId,
	// 	"timestamp": 1696291200
	// }
	const mapped = []
 	for (let tournamentObj of playerTournaments){
 		const {playerId, eventId, tournamentId, tournamentName, startAt, isOnline, numEntrants} = tournamentObj
 		// console.log("tournamentName: ", tournamentName)
 		let variables = {
 			playerId,
 			eventId,
 			tournamentId
 		}
	  const eventResults = await getAllPages(query2, variables, ["tournament", "events"], 0, false)
	  if (eventResults.length){
	  	const sets = eventResults[0].sets.nodes.reverse()
	  	let placement
	  	const mappedSets = sets.map((set) => {
					const [player1, player2] = set.slots
					// note that placement will always have the same value throughout the event
					placement = player1.entrant.participants[0].player.id === player.playerId ? player1.entrant.standing?.placement : player2.entrant.standing?.placement
	  			const s = {
						"winner": set.winnerId,
						"displayScore": set.displayScore,
						"round": set.fullRoundText,
						"player1": {"score": player1.standing?.stats?.score?.value, "entrantId": player1.entrant.id, "gamerTag": player1.entrant.participants[0].player.gamerTag, "playerId": player1.entrant.participants[0].player.id},
						"player2": {"score": player2.standing?.stats?.score?.value, "entrantId": player2.entrant.id, "gamerTag": player2.entrant.participants[0].player.gamerTag, "playerId": player2.entrant.participants[0].player.id}
					}
					return s
	  	})
	  	const eventSetObj = {
	  		event: {
	  			id: eventId,
	  			tournamentId: tournamentId,
	  			tournament: tournamentName,
	  			startAt: new Date(startAt*1000),
	  			numEntrants: numEntrants,
	  			placement: placement,
	  			timestamp: startAt,
	  			isOnline: isOnline
	  		},
	  		sets: mappedSets
	  	}
	  	mapped.push(eventSetObj)
	  }
 	} 
	


	// const results = await getAllPages(query1, variables, ["player", "sets"])
	// let mapped = results.reduce((acc, res) => {
	// 	// only get melee singles sets if the player played in multiple sets in the tournament 
	// 	if (res.event.videogame.id === 1 && res.event.type === 1){
	// 		if (!(res.event.tournament.id in acc)){
	// 			acc[res.event.tournament.id] = {"sets": [], "event": {}}
	// 		}
	// 		const [player1, player2] = res.slots
	//     const placement = player1.entrant.participants[0].player.id === player.playerId ? player1.entrant.standing?.placement : player2.entrant.standing?.placement
	// 		const set = {
	// 				"winner": res.winnerId,
	// 				"displayScore": res.displayScore,
	// 				"round": res.fullRoundText,
	// 				"player1": {"score": player1.standing?.stats?.score?.value, "entrantId": player1.entrant.id, "gamerTag": player1.entrant.participants[0].player.gamerTag, "playerId": player1.entrant.participants[0].player.id},
	// 				"player2": {"score": player2.standing?.stats?.score?.value, "entrantId": player2.entrant.id, "gamerTag": player2.entrant.participants[0].player.gamerTag, "playerId": player2.entrant.participants[0].player.id}
	// 		}
	// 		// add new sets to the front of the array since the sets are in most recent order (rather than the order at which they were played)
	// 		acc[res.event.tournament.id]["sets"].unshift(set)
	// 		acc[res.event.tournament.id]["event"] = {
	// 			id: res.event.id,
	// 			tournament: res.event.tournament.name, 
	// 			tournamentId: res.event.tournament.id,
	// 			numEntrants: res.event.numEntrants,
	// 			placement: placement, 
	// 			startAt: new Date(res.event.startAt * 1000)}
	// 	}
	// 	return acc
	// }, {})
	// mapped = Object.values(mapped).sort((a, b) => new Date(b.event.startAt) - new Date(a.event.startAt))
	// console.log(JSON.stringify(mapped))
	
	// the cursor is used for pagination, it is the last id in the list
	// don't include the last element since this element determines the "next" pointer
	// if there was a next cursor, get the previous cursor too
	const nextCursor = mapped.length === limit + 1 ? mapped[mapped.length-1].event.timestamp : null
  res.json({"results": mapped.length === limit + 1 ? mapped.slice(0, mapped.length-1) : mapped, "nextCursor": nextCursor})
})

module.exports = router