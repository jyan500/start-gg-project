const axios = require("axios")

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

const makePaginatedCall = async (queryString, variables, keys) => {
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
			currentPage += 1
			allResults = [...allResults, ...data["nodes"]]
			totalPages = data["pageInfo"]["totalPages"]
		}
		else {
			break
		}
	}
	return allResults
}

module.exports = { sendGraphQLRequest, makePaginatedCall }