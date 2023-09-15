const express = require("express")
const axios = require("axios")
const router = express.Router()

router.get("/", (req, res) => {	
	const query = `
	query NorcalMeleeTournaments($perPage: Int, $page: Int, $afterDate: Timestamp, $coordinates: String!, $radius: String!, $videogameId: ID!) {
  tournaments(query: {
    page: $page,
    perPage: $perPage
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
    nodes {
      id
      name
      city
      startAt
      url
      venueName
      venueAddress

      events(filter: {
        videogameId: 1
      }){
        id
        name
        slug
        entrants{
          nodes {
            participants {
              id
              gamerTag
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
		"perPage": 30,
		"coordinates": "37.7749, -122.4194",
		"radius": "100mi",
		"afterDate": Math.floor(new Date().getTime()/1000) // Today's date in unix timestamp
	}
	const sendGraphQLRequest = async () => {
		try {
			const response = await axios.post(
				process.env.START_GG_BASE_URL,
				{
					query,
					variables
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Authorization": process.env.START_GG_AUTH_TOKEN
					}
				}
			)
			if (response.status == 200){
				const data = response.data.data.tournaments.nodes
				return data
			}
			else {
				console.log("Graph QL Request Failed: ", response.statusText)
				return {"failed": response.statusText}
			}
		}
		catch (error) {
			return {"error": error.message}
		}
	}
	sendGraphQLRequest().then((tournaments) => {
		const result = []
		Object.values(tournaments).forEach((tournament) => {
			const meleeSingles = tournament.events.find((event) => event.name.toLowerCase().includes("singles")) ?? {}
			const meleeDoubles = tournament.events.find((event) => event.name.toLowerCase().includes("doubles")) ?? {}
			let tournamentWithEntrants = {
				...tournament,
				startAt: new Date(tournament.startAt * 1000),
				singlesParticipants: Object.keys(meleeSingles).length > 0 ? meleeSingles.entrants.nodes.map((entrant) => ({
					id: entrant.participants[0].id,
					gamerTag: entrant.participants[0].gamerTag
				})) : [],
				doublesParticipants: Object.keys(meleeDoubles).length > 0 ? meleeDoubles.entrants.nodes.map((entrant) => ({
					id1: entrant.participants[0].id,
					gamerTag1: entrant.participants[0].gamerTag,
					id2: entrant.participants[1].id,
					gamerTag2: entrant.participants[1].gamerTag,
				})) : [],
			}
			// parse out entrants from the final result as it's not needed
			const {entrants, ...parsedTournament} = tournamentWithEntrants 
			result.push(parsedTournament)
		})
		console.log(JSON.stringify(result))
		res.json(result)
	})
})

module.exports = router