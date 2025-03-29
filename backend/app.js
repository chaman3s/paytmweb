const express = require('express');
const cors = require('cors');
const mainRotues = require('./routes/index');
const {mongoUrl,Session_secret} = require("./config/var");

const app = express();
const session = require("express-session");

app.use(session({
    secret:Session_secret , // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For development; set to true in production with HTTPS
}));


app.use(cors({
    origin: '*', // Allows all websites (including localhost) to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: false // Set to false if you do not need to send credentials (cookies or HTTP authentication)
  }));
app.options('*', cors());
app.use(express.json());
const connectDB = require('./config/db'); 

const User = require('./models/User');
console.log("hello ",Session_secret)
require('dotenv').config();
connectDB();


app.use('/api/v1/',mainRotues);
app.get("/", async (req, res) => {
    try {
        const users = await User.find();
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});