const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const express_sessions = require('express-session');
// const formidable = require('express-formidable');
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

//for form uploads with files
// app.use(formidable());

//initializing passport
app.use(express_sessions({
    secret: 'SachinTendulkarIsTheGreatestBatsmanOfAllTime'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(path.join(__dirname,'public')));
app.use('/root',require('./routes/root').route);
app.use('/profile',require('./routes/profile').route);
app.use('/login',require('./routes/login').route);
app.use('/signup',require('./routes/signup').route);

app.listen(port, ()=>{console.log(`Mode: ${process.env.NodeEnv} hosted on port ${port}`)});

