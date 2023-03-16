require('dotenv').config() ;
const express = require('express') ; 
const ejs = require('ejs') ;
const mongoose = require('mongoose') ;
const bodyParser = require('body-parser') ;
const {mainDb} = require('./models/emPass') ;
const MongoDBConnected = require('./config/connection') ;
// security using md5
const md5 = require('md5') ;
const app = express() ; 


MongoDBConnected() ; 

// Use app.use(express.json()); to implement it in recent versions 
// for JSON bodies. For URL encoded bodies (the kind produced by HTTP form POSTs) 
// use app.use(express.urlencoded());

app.use(bodyParser.urlencoded({extended:true})) ;

app.use(express.json()) ;

app.use(express.static("public")) ; 

app.set('view engine', 'ejs') ;

app.get('/', (req,res)=>{
    res.render("home")
}) ; 

app.get('/login', (req,res)=>{
    res.render("login")
}) ;

app.get('/register', (req,res)=>{
    res.render("register")
}) ;

app.post('/register', async (req,res)=>{

    // the below code is using md5 
    const newUser = new mainDb(
        {
            username: req.body.username,
            //hashing password using md5 module 
            password: md5(req.body.password)
        }
    )
    newUser.save()
        .then(()=>{
            res.render('secrets') ;
        })
        .catch((err)=>{
            console.log(err) ;
        })
});

app.post('/login', (req,res)=>{
    
    // the below code is using md5 
    const username = req.body.username ;
    const password = md5(req.body.password) ; 
    const promise = async () => {
        const query = mainDb.where({username:username})
        try {
            const result = await query.findOne() ; 
            if(password === result.password) {
                res.render('secrets') ;
            } else {
                console.log("Incorrect password entered") ;
            }
        } catch (err) {
            console.log(err)
        }
    }
    promise() ;
});

app.listen(3000, () => console.log(`Server running on port 3000.`)) ;