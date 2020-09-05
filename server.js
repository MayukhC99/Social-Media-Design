const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

//setting up enviornment
dotenv.config({path: "./config/config.env"});

//connecting to database
require('./config/connection_db').connect_with_MongoDB();

const app = express();
let port = process.env.PORT || 3000;




app.listen(port, ()=>{console.log(`Mode: ${process.env.NodeEnv} hosted on port ${port}`)});

