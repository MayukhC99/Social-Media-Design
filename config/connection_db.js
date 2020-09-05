const mongoose = require('mongoose');

let connect_with_MongoDB = function(){

    let URL = process.env.MONGO_URI;
    console.log(URL);

    const connect = mongoose.connect(URL , { useUnifiedTopology: true, useNewUrlParser: true });
    connect.then((DB)=>{
        console.log("Database successfully connected");
    }, (err)=>{
        console.log("An error has occured while connecting to Database");
        console.log(err);
    })
}

module.exports = {
    connect_with_MongoDB
};