const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: {type: String, required: true, default: 'entityId' },
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);


const reply = new Schema({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    Likes: String
});

const comment = new Schema({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    Likes: String,
    replies: [reply]
});


const post = new Schema({
    order_id:{
        type: String
    },
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
    comments: [comment],
    users_liked: [{username: String}]
},{
    timestamps: true
});


post.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, 
    {upsert:true,  setDefaultsOnInsert: true, useFindAndModify: false}, 
    function(error, counter)   {
        if(error)
            return next(error);
        doc.order_id = counter.seq;
        next();
    });
});


const posts = mongoose.model('post',post);

module.exports = {
    posts
};





