
const Errorhander = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


// Register User 

     exports.registerUser = catchAsyncError(async(req,res,next)=>{
  
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
          folder:"avatars",
          width:150,
          crop:"scale"
        }) 
     const {name,email,password} =req.body;

     const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url           
     }
     })
     sendToken(user,201,res);
   //     const token = user.getJWTToken();
   //     res.json({
   //     success:true,  
   //     token
   //   }).status(201);
     
   });


     // Login User

        exports.loginUser = catchAsyncError(async(req,res,next)=>{   
           const {email,password}= req.body;
            
            // checking if user has given password and email both
             
            if(!email || !password){
                return next(new Errorhander("Please Enter Email & Password",400));
           }

           const user = await User.findOne({email}).select("+password");

           if(!user){
            return next(new Errorhander("Invalid Email Or Password",401));
         }
         
         const isPasswordMatched = await user.comparePassword(password); 

         if(!isPasswordMatched){
          return next(new Errorhander("Invalid Email Or Password",401));
       } 
       
       sendToken(user,200,res);
              
      //  const token = user.getJWTToken();
      //  res.json({
      //  success:true,  
      //  token
      //  }).status(200);
     
        });


  //  LogOut User 
      
  exports.logout = catchAsyncError(async(req,res,next)=>{
     
    res.cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true,
    });

    res.json({
      success:true,
      message:"Logged Out",
    }).status(200)

  })
  


  // Forgot Password 
   exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
     const user = await User.findOne({email:req.body.email});

     if(!user){
        return next(new Errorhander("User Not Found",404));
     }

     // Get ResetPassword Token
     
        const resetToken = user.getResetPasswordToken();    // data change 
        await user.save({validateBeforeSave:false});


        // http://localhost:3000/password/forgot
        // const url = `http://localhost:3000/password/forgot/${resetToken}`
        // console.log(url);
// 587
//        create Link Email         
        // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
           // host
       const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
        console.log("resetPasswordURL",resetPasswordUrl);

        /* const resetPasswordUrl = url ;*/ 
        const message = `Your Password Reset Token is ttemp :-\n\n ${resetPasswordUrl}\n\nIf You Have Not Requested This Email
        Then Please Ignore It.`;
        
        try {
           
             
          await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
          });
 
          res.json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
          }).status(200);
          
        } catch (error) {
           user.resetPasswordToken = undefined;
           user.resetPasswordExpire= undefined;

           await user.save({validateBeforeSave:false});
           return next(new Errorhander(error.message,500));

        }         
   }) 



   //  Reset Password
       
   exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
   
     const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt : Date.now()},
     });

     
     if(!user){
      return next(new Errorhander("Reset Password Token is invalid or has been expired",401));
   }

   if(req.body.password !==req.body.confirmPassword){
    return next(new Errorhander(" Password does not password ",400));
 }
       
   user.password = req.body.password;
   user.resetPasswordToken = undefined;
   user.resetPasswordExpire = undefined;
     
   await user.save();

   sendToken(user,200,res);


   })


  //  Get User Detail 

    exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
       const user = await User.findById(req.user.id);

       res.json({
         success:true,   
        user
       }).status(200);
    });



    
  //  Update user Password
  
    exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword); 

    if(!isPasswordMatched){
     return next(new Errorhander("Old Password is Incorrect ",400));
  } 


  if(req.body.newPassword !==req.body.confirmPassword){
    return next(new Errorhander("Password does not match"));
    }
   
    user.password = req.body.newPassword ; 
    
     await user.save();

      sendToken(user,200,res);
    // res.json({
    //   success:true,   
    //  user
    // }).status(200)
 })


//   Update User Profile 






exports.updateProfile = catchAsyncError(async(req,res,next)=>{
  const newUserDate = {
     name:req.body.name,
     email:req.body.email
  };
        if(req.body.avatar!==""){
          const user = await User.findById(req.user.id);
          const imagId = user.avatar.public_id;
           await cloudinary.v2.uploader.destroy(imagId);

           const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width : 150,
            crop : "scale"             
        })
        newUserDate.avatar = {
          public_id : myCloud.public_id,
          url       : myCloud.secure_url   
        }
     } 
     const user = await User.findByIdAndUpdate(req.user.id,newUserDate,{
      new:true,
      runValidators:true,
      useFindAndModify:false
     });
     console.log(user);
     res.json({
         success:true
     }).status(200);
     });




  // Get All User (admin)

   exports.getAllUser = catchAsyncError(async(req,res,next)=>{
     const users = await User.find();

      res.json({
         success:true,
          users
      }).status(200);

   });


   
  // Get Single User (admin)

  exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
          console.log(req.params.id)
    const user = await User.findById(req.params.id);        
                                
    if(!user){
      return next(new Errorhander(`User Does Not Exist With Id ${req.params.id}`));
    }
 
     res.json({
        success:true,
         user
     }).status(200);

  });



       
//   Update User Role  --------(admin)

exports.updateUserRole = catchAsyncError(async(req,res,next)=>{      
  
  const newUserDate = {
     name:req.body.name,
     email:req.body.email,
     role:req.body.role
  };


     const user = await User.findByIdAndUpdate(req.params.id,newUserDate,{
      new:true,
      runValidators:true,
      useFindAndModify:false
     })
     
     if(!user){
      return next(new Errorhander(`User Role Not Found `));
    }

     res.json({
         success:true
     }).status(200);
     
})




//   Delete User Role  --------(admin)

exports.deleteUser = catchAsyncError(async(req,res,next)=>{
  
   // we will Romove  cloudNary Later

     const user = await User.findById(req.params.id);
   
     if(!user){
      return next(new Errorhander(`User Does Not Exist With Id ${req.params.id}`));
    }
        const imagId = user.avatar.public_id;
          await cloudinary.v2.uploader.destroy(imagId);

    await user.deleteOne();

     res.json({
         success:true,
         message:"User Deleted  SuccessFuly"
     }).status(200);
     
})




























































































































































































































































































