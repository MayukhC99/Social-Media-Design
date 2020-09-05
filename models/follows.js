const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const follow = new Schema({
    username: {
        type: String,
        required: true
    },
    following: {
        type: String,
        required: true
    }
});


const follows = mongoose.model('follow',follow);

module.exports = {
    follows
};
