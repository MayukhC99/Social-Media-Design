const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reply = new Schema({
    text: {
        type: String,
        required: true
    },
    Likes: String
});

const comment = new Schema({
    text: {
        type: String,
        required: true
    },
    Likes: String,
    replies: [reply]
});


const post = new Schema({
    username: {
        type: String,
        required: true
    },
    head: {
        type: String,
        required: true
    },
    text: String,
    image: String,
    video: String,
    Likes: String,
    comments: [comment]
},{
    timestamps: true
});


const post = mongoose.model('post',post);

module.exports = {
    post
};





