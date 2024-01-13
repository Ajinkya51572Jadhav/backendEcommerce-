

const Errorhander = require("../utils/errorhandler");               

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500 ;
    err.message  = err.message || "Internal Server Error" ;

       // wrong Mongodb id Error 

            if(err.name==="castError"){
                  const message  =`Resource not Found Invalid : ${err.path}`;
                  err=new Errorhander(message,400);
            }

            // Mongoose deplicate Key Error

            if(err.code===11000){
                  const message  =`Duplicate ${Object.keys(err.keyValue)} Entered`;
                  err=new Errorhander(message,400);
            }

            // Json Web Token error throw

            if(err.name==="JsonWebTokenError"){
                  const message  =`Json Web Token Invalid , try Again`;
                  err=new Errorhander(message,400);
            }

             //  JWT  EXPIRE ERROR 
              
              if(err.name==="TokenExpiredError"){
                  const message  =`Json Web Token is Expired  , try Again`;
                  err=new Errorhander(message,400);
            }

             
              



   res.json({
    success:false,
    message:err.message
   }).status(err.statusCode);
}