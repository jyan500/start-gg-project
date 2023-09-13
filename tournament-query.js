// graph QL query to 
// get all entrants for norcal melee tournies within 100 mi radius of San Francisco
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
        entrants(query: {
          perPage: 100
        }){
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


variables: 
{
  "page": 2,
  "videogameId":1,
  "perPage": 30,
  "coordinates": "37.7749, -122.4194",
  "radius": "100mi",
  "afterDate": 1656633600	// July 1st, 2022
}