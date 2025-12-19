const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

module.exports.registerUser= async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"User with this email already exists"});
        } 
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({username,email,password: hashedPassword});
        res.status(201).json({message:"User Registered Successfully",user});
    }catch(error){
        res.status(400).json({error: error.message});
    }
} 

module.exports.loginUser= async(req,res)=>{
    try{
        const {email,password}=req.body;
        
        // Check for admin credentials
        if(email === 'admin@sece.ac.in' && password === 'admin@123'){
            const token=jwt.sign(
                {userId: 'admin',email: email, role: 'admin'}, 
                process.env.SECRET_KEY, 
                {expiresIn: '1h'});
            return res.status(200).json({message:"Admin Login Successful",token});
        }
        
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User Not Found"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({error:"Invalid Password"});
        }
        const token=jwt.sign(
            {userId: user._id,email: user.email}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'});
        res.status(200).json({message:"Login Successful",token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}