from graphqlclient import GraphQLClient
from datetime import datetime
import json

apiVersion = "alpha"
url = "https://api.start.gg/gql/" + apiVersion
authToken = "Bearer 0f094f75cce42471a5658c7a94a97db4"

client = GraphQLClient(url)
client.inject_token(authToken)
result = client.execute("""
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
""", {
	"page": 1,
	"videogameId":1,
	"perPage": 30,
	"coordinates": "37.7749, -122.4194",
	"radius": "100mi",
	"afterDate": 1656633600 #July 1st, 2022
})

resData = json.loads(result)
tournaments = resData["data"]["tournaments"]["nodes"]
for tournament in tournaments:
	print("***************")
	print(tournament["name"])
	dt = datetime.fromtimestamp(tournament["startAt"])
	print("start time: ", datetime.strftime(dt, "%d %B, %Y"))
	print("***************")
	events = tournament["events"]
	for event in events:
		if "Singles" in event["name"]:
			entrants = event["entrants"]["nodes"]
			print("Participants: ")
			for entrant in entrants:
				participant = entrant["participants"][0]
				print("gamertag: ", participant["gamerTag"])


