/* 
  Populates the tournaments that this player has ever competed in locally since this information
  does not get updated on start.gg very often
*/
const { getAllPages, getPage, sleep } = require("../utils/utils")
const axios = require("axios")
const Player = require("../models/Player")
const PlayerTournament = require("../models/PlayerTournament")
const mongoose = require("mongoose")
require("dotenv").config({ path: "../.env"})

const getPlayerTournaments = async (ts, query, player) => {
    let variables = {
      "page": 1,
      "playerId": player.playerId,
      // "timestamp":  d.getTime()/1000
      // "timestamp":  1667543300
      "timestamp":  ts
    }
    return await getAllPages(query, variables, ["player", "sets"], 1000)
}

const populateTournamentsAttended = async () => {

  mongoose.connect('mongodb://localhost/start-gg-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to mongo db")
  })

  // uncomment to clean the database
  // await PlayerTournament.deleteMany({})

  const query1 = `
  query Sets ($playerId: ID!, $page: Int, $timestamp: Timestamp){
  player(id: $playerId) {
    sets(perPage: 200, page: $page, filters: {updatedAfter: $timestamp}) {
    	pageInfo {
  	  	totalPages
  	  	page
    	}
      nodes {
        event {
          id
          startAt
          type
          videogame {
            id
          }
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
  const d = new Date()
  // four years ago
  d.setFullYear(d.getFullYear()-4)
  const ts = parseInt(d.getTime()/1000)
  const players = await Player.find()
  // const players = await Player.find({"gamerTag": { "$regex": "j_noodles", "$options": "i"}}, { _id: 0}).sort({"gamerTag": 1})
  for (let p of players){
    console.log("*** processing for: ", p.gamerTag, "***")
    const res = await getPlayerTournaments(ts, query1, p)
    const tournaments = {}
    res.map((result) => {
      const {id: eventId, startAt, videogame, type, tournament} = result.event || {}
      const tournamentId = tournament?.id
      // only get melee singles sets, we'd expect only one event of this type
      // per tournament so we can have eventId and startAt as the value to the tournamentId key
      // without worrying about overwriting a previous one
      if (result.event && videogame.id === 1 && type === 1 && tournamentId && !(tournamentId in tournaments)){
        tournaments[tournamentId] = {eventId, startAt, "tournamentName": tournament?.name, tournamentId}
      }
    })
    const sortedTournaments = Object.values(tournaments).sort((a, b) => new Date(b.startAt*1000) - new Date(a.startAt*1000))
    const mapped = Object.keys(tournaments).map((tId) => {
      return {
        updateOne: {
          filter: {playerId: p.playerId, tournamentId: tId, eventId: tournaments[tId].eventId},
          update: {playerId: p.playerId, tournamentId: tId, eventId: tournaments[tId].eventId, startAt: tournaments[tId].startAt, tournamentName: tournaments[tId].tournamentName},
          upsert: true
        }
      }
    })
    try {
      await PlayerTournament.bulkWrite(mapped)
    }
    catch (error){
      console.log(error)
    }
  }
}

populateTournamentsAttended().then(() => {
  process.exit(1)
})
