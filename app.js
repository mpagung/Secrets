//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.route("/login")

  .get(function(req,res){
    res.render("login");
  })

  .post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},function(err,foundUser){
      if (err){
        console.log(err)
      } else {
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          } else {
            res.send("WRONG PASSWORD!");
          }
        } else {
          res.send("USER NOT FOUND!");
        }
      }
    });
  });



app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if (!err){
      res.render("secrets");
    } else {
      res.send(err);
    }
  })
});



app.listen(3000,function(){
  console.log("Server deployed");
})
