const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = process.env.MONGODB_URI
const MongoDBConnected = () => {
    mongoose.connect(mongoURI)
        .then(() => console.log("Connected to MongoDB successfully"))
        .catch((err) => console.log("Error while connecting to MongoDB\n", err))
}

module.exports = MongoDBConnected