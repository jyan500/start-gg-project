const axios = require("axios")

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const sendGraphQLRequest = async (query, variables) => {
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
			return response.data.data
		}
		else {
			return {"failed": response.statusText}
		}
	}
	catch (error) {
		return {"error": error.message}
	}
}

const getPage = async (queryString, variables, keys, currentPageParam = 1, totalPagesParam = 1, expectObj = true) => {
	// make an initial request to find out what the totalPages amount is
	let currentPage = currentPageParam
	let totalPages = totalPagesParam
	let allResults = []
	if (!totalPages || currentPage <= totalPages){
		const res = await sendGraphQLRequest(queryString, {...variables, page: currentPage})
		if (res){
			let data = res
			for (let k of keys){
				data = data[k]
				if (!data){
					console.log("Something has gone wrong while parsing data, returning collected data...")
					break
				}
			}
			if (expectObj){
				allResults = [...allResults, ...data["nodes"]]
				totalPages = data["pageInfo"]["totalPages"]		
			}
			else {
				allResults = [...allResults, ...data]
			}
		}

	}
	return [allResults, currentPage, totalPages]
}

const getAllPages = async (queryString, variables, keys, batch = 500, expectObj = true) => {
	let totalPages = 1 
	let currentPage = 1
	let allResults = []
	while (!totalPages || currentPage <= totalPages) {
		const res = await sendGraphQLRequest(queryString, {...variables, page: currentPage})
		if (res){
			let data = res
			for (let k of keys){
				data = data[k]
				if (!data){
					console.log("Something has gone wrong while parsing data, returning collected data...")
					break
				}
			}
			if (data){
				currentPage += 1
				if (expectObj){
					allResults = [...allResults, ...data["nodes"]]
					totalPages = data["pageInfo"]["totalPages"]
					if (totalPages === 0){
						break
					}
				}
				else {
					allResults = [...allResults, ...data]
				}
			}
			else {
				break
			}
		}
		else {
			break
		}
		await sleep(batch)
	}
	return allResults
}

module.exports = { sendGraphQLRequest, getAllPages, getPage, sleep }