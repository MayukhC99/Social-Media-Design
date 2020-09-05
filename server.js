const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const express_sessions = require('express-session');
const passport = require('./passport').passport;

//setting up enviornment
dotenv.config({path: "./config/config.env"});

//connecting to database
require('./config/connection_db').connect_with_MongoDB();

const app = express();
let port = process.env.PORT || 3000;

//decrypting json and urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//initializing passport
app.use(express_sessions({
    secret: 'SachinTendulkarIsTheGreatestBatsmanOfAllTime'
}));
app.use(passport.initialize());
app.use(passport.session());


app.listen(port, ()=>{console.log(`Mode: ${process.env.NodeEnv} hosted on port ${port}`)});

