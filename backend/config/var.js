require("dotenv").config();

module.exports = {
	JWT_SECRET: process.env.Jwt_Secret,
	dataApiUrl: process.env.MONGO_DATA_API_URL,
    dataApiKey:  process.env.MONGO_DATA_API_KEY,
	database: process.env.MONGO_DATA_database,
	Source : process.env.MONGO_DATA_Source,
}