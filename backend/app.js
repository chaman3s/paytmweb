const express = require('express');
const cors = require('cors');
const mainRotues = require('./routes/index');

const app = express();
app.use(cors({
    origin: '*', // Allows all websites (including localhost) to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: false // Set to false if you do not need to send credentials (cookies or HTTP authentication)
  }));
app.use(express.json());
const connectDB = require('./config/db'); 

require('dotenv').config();
connectDB();


app.use('/api/v1/',mainRotues);
app.get('/',(req, res)=>{

    res.json({msg:"hello"});
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
