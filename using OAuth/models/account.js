const mongoose = require('mongoose'); 
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const Account = new mongoose.Schema({
    username: String, 
    password: String,
    googleId: String,
    facebookId: String,
    secret: String
});

Account.plugin(passportLocalMongoose);
Account.plugin(findOrCreate);

module.exports = mongoose.model('Account', Account);