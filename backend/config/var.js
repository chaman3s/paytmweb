require("dotenv").config();
console.log("process.env.sessions_scert:",process.env.Sessions_secret);
module.exports = {
	JWT_SECRET: process.env.Jwt_Secret,
	dataApiUrl: process.env.MONGO_DATA_API_URL,
    dataApiKey:  process.env.MONGO_DATA_API_KEY,
	database: process.env.MONGO_DATA_database,
	Source : process.env.MONGO_DATA_Source,
	mongoUrl:process.env.MONGO_URI,
	Session_secret: process.env.Sessions_secret
}