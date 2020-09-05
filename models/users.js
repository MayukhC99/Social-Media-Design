const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: String,
    last_name: String,
    profile_picture: {
        type: String,
        default: '000.png'
    }
},{
    timestamps: true
})

const users = mongoose.model('user',user);

module.exports = {
    users
};