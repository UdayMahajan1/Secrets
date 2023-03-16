require('dotenv').config() ;
const mongoose = require('mongoose') ;
const encrypt = require('mongoose-encryption') ;

const emPass = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true           
        },
        password: {
            type: String, 
            required: true
        }
    }
) ;

// security using encryption 

const secret = process.env.SECRET_KEY ;

emPass.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const mainDb = mongoose.model('User', emPass) ;

module.exports = {
    mainDb: mainDb
} ;