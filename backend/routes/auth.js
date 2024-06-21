const express = require('express')
const router = express.Router()
const User = require("../models/User.js")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser.js')

const JWT_SECRET = "ManjilDhungana";


//Route 1:- Create a user using: POST '/auth/createuser' . No login required
router.post('/createuser',[
    body('name','Enter a valid Name').isLength({min:5}),
    body('email','Enter a valid Email').isEmail(),
    body('password','Enter a valid Password').isLength({min:5})
],async (req,res)=>{
    let success = false;
    // If there are errors, return bad requests and the errrors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }

    try {
        //Check whether the user with same email exists already
        let user = await  User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({success,errors:"Sorry a user with this email exists already"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        const data = {
            user:{
                id:user.id
            }
        }
       
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken})

    } catch (error) {
        console.error(error.message)
        res.status(500).json({success,error:"Some unexpected error Occured"});
    }
})



//Route 2:- user login using: POST '/auth/login' . No login required
router.post('/login',[
    body('email','Enter a valid Email').isEmail(),
    body('password','Enter a valid Password').isLength({min:5})
],async (req,res)=>{
    // If there are errors, return bad requests and the errrors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        let success = false;
        if(!user){
            return res.status(400).json({success,errors:"Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,errors:"Please try to login with correct credentials"});
        }
        const data = {
            user:{
                id:user.id
            }
        }

        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken})

        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"});
    }
})



//Route 3:- Get user details using: POST '/auth/getuser' . login required
router.post('/getuser',fetchuser,async (req,res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"});
    }
})



module.exports = router