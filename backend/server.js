const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User.js');  
const bcrypt = require('bcrypt'); 


const app = express(); 

mongoose.connect('mongodb://127.0.0.1:27017/AuthG18')
app.use(express.json());
app.use(express.urlencoded()); 


app.post('/register', async (req, res) => {
    const user = req.body; 
    if (!user.password || !user.username) {
        res.send("Username and password are required"); 
        return;     
    }
    if (user.password.length < 4) {
        res.send("Password length must be >= 4");
        return; 
    }

    const newUser = new User(user);
    const saltRounds = 10;

    const hashedPwd = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPwd; 

    try {
        await newUser.save();
        res.send("Registration successful"); 
    } catch(err) {
        res.send("Couldn't register account");
    }

})


app.get('/profile', (req, res) => {
    res.send("User's profile");
})


app.post('/login', async (req, res) => {
    const loginData = req.body; 
    const account = await User.findOne().where('username').equals(loginData.username)

    if (!account) {
        res.send("No such account"); 
        return;
    }
    // Account found
    const match = await bcrypt.compare(loginData.password, account.password)
    if (!match) {
        res.send("Incorrect password"); 
        return; 
    }

    res.send({
        msg: "Login succesful",
    })

})



app.listen(3000, () => {
    console.log("http://localhost:3000"); 
})


