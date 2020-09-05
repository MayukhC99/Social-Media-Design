const express = require('express');
const users = require('../models/users').users;
const posts = require('../models/posts').posts;
const follows = require('../models/follows').follows;
const route = express.Router();

//api to get details of a user
route.get('get_details',(req,res)=>{
    users.findOne({username: req.user.username}, function(err,docs){
        if(err){
            console.log('Error occured in /profile/get_details');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("user found in /profile/get_details");
            return res.send(docs);
        } else {
            console.log("No Such user");
            return res.send(undefined);
        }
    })
})

//api to get following users
route.get('get_following',(req,res)=>{
    follows.find({username: req.user.username}, function(err,docs){
        if(err){
            console.log('Error occured in /profile/get_following');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("users found in /profile/get_following");
            return res.send(docs);
        } else {
            console.log("No users following");
            return res.send(undefined);
        }
    })
})

//api to get followers
route.get('get_followers',(req,res)=>{
    follows.find({following: req.user.username}, function(err,docs){
        if(err){
            console.log('Error occured in /profile/get_followers');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("users found in /profile/get_followers");
            return res.send(docs);
        } else {
            console.log("No followers");
            return res.send(undefined);
        }
    })
})


// const post = new Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     head: {
//         type: String,
//         required: true
//     },
//     text: String,
//     image: String,
//     video: String,
//     Likes: String,
//     comments: [comment]
// },{
//     timestamps: true
// });

//api to get individual posts
route.get('all_posts_individual',(req,res)=>{
    posts.find({username: req.user.username},function(err,docs){
        if(err){
            console.log('Error occured in /profile/all_posts_individual');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("posts found in /profile/all_posts_individual");
            return res.send(docs);
        } else {
            console.log("No Posts");
            return res.send(undefined);
        }
    })
});

//api to get all post in reverse chronological order
route.get('all_posts_explore',(req,res)=>{
    posts.find({}).sort({updatedAt: 'desc'}).exec(function(err, docs) { 
        if(err){
            console.log('Error occured in /profile/all_posts_explore');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("posts found in /profile/all_posts_explore");
            return res.send(docs);
        } else {
            console.log("No Posts");
            return res.send(undefined);
        }
     });
})


// const follow = new Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     following: {
//         type: String,
//         required: true
//     }
// });
//api to get all posts by the followers
route.get('all_posts_followers',(req,res)=>{
    follows.aggregate([
        { "$match": { "username": req.user.username } },
        {
            $lookup: {
                from: "posts", // collection name in db
                localField: "following",
                foreignField: "username",
                as: "Posts_of_following"
            }
        }
    ]).exec(function(err, docs) {
        if(err){
            console.log('Error occured in /profile/all_posts_followers');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("posts found in /profile/all_posts_followers");
            return res.send(docs);
        } else {
            console.log("No Posts");
            return res.send(undefined);
        }
    });
});



module.exports = {
    route
};