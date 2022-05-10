const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10

app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/bcryptDB")

const userschema = new mongoose.Schema({
    user:String,
    password:String
})

const User = new mongoose.model("User",userschema)

app.get("/register",(req,res)=>{
    res.sendFile(__dirname+"/register.html")
})
app.post("/register",(req,res)=>{
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newuser = new User({
            user:req.body.email,
            password:hash
        })
        newuser.save((err)=>{
            if(err){
                console.log(err)
                res.redirect("/register")
            }else{
                console.log("user registered")
                res.sendFile(__dirname+"/dashboard.html")
            }
        })
    });
   
   
})
app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/login.html")
})
app.post("/login",(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    User.findOne({user:email},(err,founduser)=>{
        if(err){
            console.log(err)
        }else{
            if(founduser){
                bcrypt.compare(password, founduser.password, function(err, result) {
                    if(result === true){
                        console.log("successful log in")
                        res.sendFile(__dirname+"/dashboard.html")
                    }
                    
                })
            }
        }
        
               
           
       
    })
})




app.listen(5000,()=>{
    console.log("app is listening on port 5000....")
})
