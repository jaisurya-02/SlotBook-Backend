const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

module.exports.registerUser= async(req,res)=>{
    try{
        const {name,email,password,userType,department,year}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"User with this email already exists"});
        }
        
        // Validate student fields
        if(userType === 'student' && (!department || !year)){
            return res.status(400).json({error:"Department and year are required for students"});
        }
        
        const hashedPassword=await bcrypt.hash(password,10);
        const userData = {
            name,
            email,
            password: hashedPassword,
            userType
        };
        
        // Add student-specific fields if applicable
        if(userType === 'student'){
            userData.department = department;
            userData.year = year;
        }
        
        const user=await User.create(userData);
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
        
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            name: user.name,
            userType: user.userType
        };
        
        // Add student-specific fields if applicable
        if(user.userType === 'student'){
            tokenPayload.department = user.department;
            tokenPayload.year = user.year;
        }
        
        const token=jwt.sign(tokenPayload, process.env.SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({message:"Login Successful",token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}