const express = require('express');
const users = require('../models/users').users;
const posts = require('../models/posts').posts;
const follows = require('../models/follows').follows;
const likedbyusers = require('../models/posts').likedbyusers;
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const route = express.Router();


//api to verify user
route.get('/verify_user',(req,res)=>{
    if(req.user){
        return res.send(req.user.username);
    } else {
        return res.send(undefined);
    }
})

//creating storage_engine
const storage_engine = multer.diskStorage({
    destination: './public/post_assets',
    filename: function(req,file,done){

        done(null,"posts"+Date.now()+path.extname(file.originalname));//path.extname can extract extension name from file name
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
}).single('post_image');  //name should be post_image


//handling post request containing the file
route.post('/post/add', (req,res)=>{

    let create_post = function(req){
        f = undefined;
        if(req.file){
            f = req.file.filename;
        }
        
        posts.create({
            username: req.user.username,
            head: req.body.head,
            text: req.body.text,
            image: f
        }, function(err,docs){
            if(err){
                console.log("Error while adding in /post/add");
                console.log(err);
                return res.send(undefined);
            }
    
            if(docs){
                console.log("post created successfully in /courses/add");
                return docs;
            } else {
                console.log("unsuccessful in /post/add");
                return undefined;
            }
        })
    }

    upload(req,res,(err)=>{
        if(err){
            console.log("Error occured in /post/add");
            return res.send(undefined);
        } else {
            if(req.file === undefined){
                console.log("file not uploaded in /post/add");
                let docs = create_post(req);
                return res.send(docs);
            } else {
                console.log("Picture successfully uploaded");

                let docs = create_post(req);
                return res.send(docs);
            }
        }
    })

})

//following user
route.post('/user/follow',(req,res)=>{
    let query = {username: req.user.username, following: req.body.username};
    let update = {
        username: req.user.username,
        following: req.body.username
    };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    follows.findOneAndUpdate(query, update, options, function(err,docs){
        if(err){
            console.log('Error occured in /user/follow');
            console.log(err);
            return res.send(undefined);
        }

        if(docs){
            console.log("docs found in /user/follow");
            return res.send(docs);
        } else {
            console.log("No Such docs");
            return res.send(undefined);
        }
    })
})

//unfollow user
route.post('/user/unfollow',(req,res)=>{
    let query = {username: req.user.username, following: req.body.username};
    follows.findOneAndDelete(query, function(err){
        if(err){
            console.log('Error occured in /user/unfollow');
            console.log(err);
            return res.send(undefined);
        }

        return res.send("success");
    })
})


route.get('/get_username',(req,res)=>{
    if(req.user){
        return res.send(req.user.username);
    }
})

//apis to increment likes
route.post('/post/inc_likes',(req,res)=>{
    posts.findById(req.body.id , (err,docs)=>{
        if(err){
            console.log("error in /root/post/inc_likes");
            return res.send(undefined);
        }

        if(docs){
            let likes;
            if(docs.Likes)
                likes = parseInt(docs.Likes);
            else 
                likes = 0;
            let Users_liked = docs.users_liked;

            if(req.user)
                Users_liked.push({"username": req.user.username}); //appending user that liked
            else
                return res.send(undefined);
            likes+= 1; //incrementint likes by 1

            posts.findOneAndUpdate({"_id": docs._id}, {
                $set: {
                    Likes: likes,
                    users_liked: Users_liked
                }
            }, {
                new: true
            }, (err,docs)=>{
                if(err){
                    console.log("error while updating in /root/post/inc_likes");
                    return res.send(undefined);
                }

                if(docs){
                    console.log("Successfully incremented likes and added users_liked");
                    likedbyusers.findOneAndUpdate({"post_id": req.body.id,"username": req.user.username}, {
                        $set:{
                            post_id: req.body.id,
                            username: req.user.username
                        }
                    },{
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }, function(err,data){
                        if(err){
                            console.log("Error in likedbyuser add");
                            return res.send(undefined);
                        }

                        return res.send(docs);
                    })
                } else {
                    console.log("post not found in /root/post/inc_likes");
                    return res.send(undefined);
                }
            })

        } else {
            console.log("posts not found in /root/post/inc_likes");
            return res.send(undefined);
        }
    })
})

//apis to decrement likes
route.post('/post/dec_likes',(req,res)=>{
    
    function remove(arr, username) {
        return arr.filter(e => e.username !== username);
    }

    posts.findById(req.body.id , (err,docs)=>{
        if(err){
            console.log("error in /root/post/dec_likes");
            return res.send(undefined);
        }

        if(docs){
            let likes;
            if(docs.Likes)
                likes = parseInt(docs.Likes);
            else 
                likes = 0;

            if(likes != 0)
                likes-= 1;
            
            let Users_liked = docs.users_liked;
            if(req.user)
                Users_liked = remove(Users_liked, req.user.username);
            else
                return res.send(undefined);


            posts.findOneAndUpdate({"_id": docs._id}, {
                $set: {
                    Likes: likes,
                    users_liked: Users_liked
                }
            }, {
                new: true
            }, (err,docs)=>{
                if(err){
                    console.log("error while updating in /root/post/dec_likes");
                    return res.send(undefined);
                }

                if(docs){
                    console.log("Successfully decremented likes and added users_liked");
                    likedbyusers.findOneAndRemove({"post_id": req.body.id,"username": req.user.username},
                    (err)=>{
                        if(err){
                            console.log("Error while decremented like");
                            return res.send(undefined);
                        }
                        return res.send(docs);
                    })
                } else {
                    console.log("post not found in /root/post/inc_likes");
                    return res.send(undefined);
                }
            })

        } else {
            console.log("posts not found in /root/post/inc_likes");
            return res.send(undefined);
        }
    })
})


//api to get all liked post by a particular user
route.post("/user/liked/posts", (req,res)=>{
    likedbyusers.aggregate([
        {"$match": { "username": req.body.username }},
        {
            $lookup: {
                from: "posts", 
                localField: "post_id",
                foreignField: "_id",
                as: "user_posts"
            }
        }
    ]).exec(function(err,docs){
        if(err){
            console.log("Error in likedbyusers joining");
            return res.send(undefined);
        }

        return res.send(docs);
    })
})


//api to check if the post is liked by the user
route.post('/post/likes_check',(req,res)=>{
    posts.findById(req.body.id , (err,docs)=>{
        if(err){
            console.log("error in /root/post/likes_check");
            return res.send(undefined);
        }

        if(docs){
            let Users_liked = docs.users_liked;
            console.log(Users_liked);
            let value = 0;

            if(req.user)
                Users_liked.map(val=>{
                    if(val.username == req.user.username){
                        value = 1;
                    }
                })
            if(value == 1)
                return res.send(true);
            else
                return res.send(false);

        } else {
            console.log("No such posts in /root/post/likes_check");
        }
    })
})


//api to add comments
route.post('/post/add_comments',(req,res)=>{
    posts.findByIdAndUpdate(req.body.id , {
        $set: {
            comments: JSON.parse(req.body.comments)
        }
    },{
        new: true
    }, (err,docs)=>{
        if(err){
            console.log("error in /post/add_comments");
            return res.send(undefined);
        }

        if(docs){
            console.log("Successfully updated comments");
            return res.send(docs);
        } else {
            console.log("Posts does not exists");
            return res.send(undefined);
        }
    })
})


//api to get the post liked by the user
route.get('/liked_by_user',(req,res)=>{

})


//api to render profile or profile view page
route.get('/:username',(req,res,next)=>{

    console.log('finding user');
    if(req.user){

      if(req.user.username == req.params.username){
        return res.sendFile(path.join(__dirname,'..','public','profile','index.html'));

      } else {

        users.findOne({username: req.params.username} , function (err,user){
            if(err){
                console.log('user not found due to error 1');
                return res.redirect('/error_404');
                //return done(err);
            }

            if (!user) {
                console.log('user not found 1');
                return res.redirect('/error_404');
                //return done(null, false, {message: "No such user"})
              }
      
              console.log('success in finding user');
    
              return res.sendFile(path.join(__dirname,'..','public','profile','index.html'));
      
              //return done(null, user);


        } ); 

      }

    } else {

      users.findOne({ username: req.params.username } , function (err,user){
          if(err){
            console.log('user not found due to error 2');
            return res.redirect('/error_404');
            //return done(err);
          }

          if (!user) {
            console.log('user not found 2');
            return res.redirect('/error_404');
            //return done(null, false, {message: "No such user"})
          }
  
          console.log('success in finding user');
  
          return res.sendFile(path.join(__dirname,'..','public','viewuser','index.html'));
  
          //return done(null, user);

      });

    }  
})



module.exports = {
    route
}
