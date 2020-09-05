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

follow.index({ username: 1, following: 1}, { unique: true });

const follows = mongoose.model('follow',follow);

module.exports = {
    follows
};
