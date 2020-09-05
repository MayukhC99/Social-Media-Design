const express = require('express');
const users = require('../models/users').users;
const route = express.Router();

route.post('/getin',(req,res)=>{
    users.create({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }, function(err,docs){
        if(err){
            console.log("Error has occured");
            return res.send(undefined);
        }

        if(docs){
            console.log("User Created: ");
            console.log(docs);
            return res.send(docs);
        }
        else
            return res.send(undefined);
    })
})

module.exports = {
    route
}