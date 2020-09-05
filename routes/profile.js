const express = require('express');
const users = require('../models/users').users;
const posts = require('../models/posts').posts;
const follows = require('../models/follows').follows;
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const route = express.Router();

const storage_engine = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req,file,done){
        
        done(null,req.user.username+'-'+Date.now()+path.extname(file.originalname));//path.extname can extract extension name from file name
    }
});

//creating fileFilter function

const customFileFilter = function(req,file,done){
    const regex= /\jpg$|\jpeg$|\png$|\gif$/

    const check_filename = regex.test(file.originalname);

    const check_mimetype= regex.test(file.mimetype);

    if(check_filename && check_mimetype){
        done(null,true);
    } else {
        done('Error: Images only');
    }
}

const upload = multer({
    storage: storage_engine,
    limits: {fileSize: 1000000},
    fileFilter: customFileFilter
}).single('profile_image');  //name should be profile_image

//handling post request containing the file(profile_picture)
route.post('/upload/profile_image',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
           return res.send(undefined);
        } else {
            if(req.file === undefined){
                res.send("undefined");
            } else {

                if(req.user.profile_picture !== '000.png'){
                    //deleting the file
                    fs.unlink('./public/uploads/'+req.user.profile_picture , (err) => {
                        if (err){
                            console.log(err);
                            throw err;
                        }
                        console.log('The file has been deleted');
                    });
                }
                req.user.profile_picture = req.file.filename;
                users.findOneAndUpdate({"username" : req.user.username},{
                    $set:{
                        profile_picture: req.file.filename
                    }
                },(err,docs)=>{
                    if(err){
                        console.log("Error Occured while uploading");
                        return res.send(undefined);
                    }
                    return res.send(req.file.filename);
                })
            }
        }
    })
})

//Api to update profile details
route.post('/profile_update', (req,res) =>{

    users.findOneAndUpdate({"username":req.user.username},{
        $set:{
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }
    }, {
        new: true
    }, (err,docs)=>{
        if(err){
            console.log("Error has occured on /profile/profile_update");
            return res.send(undefined);
        }
        
        return res.send(docs);
    })
})


//to delete profile picture
route.get('/delete/profile_image',(req,res)=>{

    if(req.user.profile_picture !== '000.png'){
        fs.unlink('./public/uploads/'+req.user.profile_picture , (err) => {
            if (err){
                console.log(err);
                throw err;
            }
            console.log('The file has been deleted');
        });
    } else {
        return res.send(undefined);
    }

    //db.query(`UPDATE users SET profile_picture="000.png" WHERE username= "${req.user.username}"`);
    users.findOneAndUpdate({"username": req.user.username},{
        $set: {
            profile_picture: "000.png"
        }
    },{
        new: true
    },(err,docs)=>{
        if(err){
            console.log("Error occured in /profile/delete/profile_image");
            return res.redirect('back');
        }

        req.user.profile_picture = "000.png";
        return res.redirect('back');
    })
})

route.post('change_password',(req,res)=>{
    users.findOneAndUpdate({username: req.user.username},{
        $set: {
            password: req.user.password
        }
    },{
        new: true
    }, (err,docs)=>{
        if(err){
            console.log("Error has occured on /profile/change_password");
            return res.send(undefined);
        }
        
        return res.send(docs);
    })
})


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