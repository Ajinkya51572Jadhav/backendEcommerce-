const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
    const Jwt  = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema=new mongoose.Schema({
   
    name:{
    type:String,
    required:[true,"Please Enter Your Name"],
    maxLength:[30,"Name Cannot Exceed 30 Characters"],
    minLength:[4,"Name Should Have More Then 4 Characters"]
        
},
   email:{
    type:String,
    required:[true,"Please Enter Your Email"],
    unique:true,
    validate:[validator.isEmail,"Please Enter A Valied Email"]
},
   password:{
    type:String,
    required:[true,"Please Enter Your Password"],
    minLength:[8,"Password Should Be Greater Then 8 Characters"],
    select:false 
 },
    avatar:{
        public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true,
    }
    
},
role :{
    type:String,
    default:"user"
}, 
 createdAt: {
    type: Date,
    default: Date.now,
  },
resetPasswordToken:String,
resetPasswordExpire:Date

});

 // passwrod hash 

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
     this.password = await bcrypt.hash(this.password,10);
})

   // Jwt Token 
      
    userSchema.methods.getJWTToken =function(){
        console.log("userModel",this._id);
        
       return  Jwt.sign({id:this._id},process.env.JWT_SECRET,{       // change data
        expiresIn:process.env.JWT_EXPIRE,
         })
    }
 
     //  Compare Password 
       
     userSchema.methods.comparePassword = async function(enteredPassword){
          return await bcrypt.compare(enteredPassword,this.password);
     };

     // Generating Password Reset Token 
     userSchema.methods.getResetPasswordToken = function(){
        
        // Generating Token
        const resetToken = crypto.randomBytes(20).toString("hex");
        
        // Hashing and adding resetPasswordToken to userSchema 
        this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        this.resetPasswordExpire = Date.now()+15*60*1000;
        return  resetToken
     }


   module.exports = mongoose.model("User",userSchema);



