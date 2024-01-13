


const Errorhander = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

 exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token}= req.cookies ; 
   //  console.log(token);

   if(!token){
      return next(new Errorhander("Please Login To Access This Resources",401));
  }
const decodeData = jwt.verify(token,process.env.JWT_SECRET);                          
   req.user =  await User.findById(decodeData.id);
      next();

 })

 exports.authorizeRoles = (...roles)=>{
   return(req,res,next)=>{

      if(!roles.includes(req.user.role)){
        return next(new Errorhander(`Role : ${req.user.role} is Not Allowed To Access This Resouce`,401));   
       
      }                                                                       
      next();
   };

 }









