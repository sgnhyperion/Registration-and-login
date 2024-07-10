const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {

    try{

        const useExists = await User.findOne({email: req.body.email});

        if(useExists){
            return res.send({
                success: false,
                message: "User already exists"
            })
        }

        const salt  = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;

        const newUser = User.create(req.body);
        await newUser.save();
        res.send("User created");
    }
    catch(err){
        res.status(201).json(err);
    }

});

router.post("/login", async (req, res) => {
    
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return res.send({
            success: false,
            message: "User does not exist, please register"
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword){
        return res.send({
            success: false,
            message: "Invalid password"
        })
    }

    res.send({
        success: true,
        message: "User logged in"
    })
});


module.exports = router;