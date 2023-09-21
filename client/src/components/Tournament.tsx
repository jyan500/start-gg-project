import React, { useEffect, useState } from "react"
import TournamentCard from "./TournamentCard"
import { Tournament as TournamentType } from "../types/common"
import api from "../config/api"
import useSWR from "swr"

const fetcher = (url: string) => api.get(url).then(res => res.data)

const Tournament = () => {
	const {data, error} = useSWR("/tournaments", fetcher)
	return (
		<div>
            {data?.map((tournament: TournamentType) => (  
                <TournamentCard tournament={tournament}></TournamentCard>
            ))} 
        </div>
	)
}

export default Tournament