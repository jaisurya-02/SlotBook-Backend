const jwt=require('jsonwebtoken');
require('dotenv').config();

const auth=(req,res,next)=>{
    console.log("Auth Middleware Invoked", req.headers);
    const token=req.headers.authorization;
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }
    try{
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
    console.log(decoded);
    req.userdata = {id: decoded.userId, email: decoded.email};
    next();
    }
    catch(error){
        return res.status(401).json({error:"Unauthorized",message: error.message});
}
}
module.exports=auth;