//  Create A Token Saving And Cookie 

    const sendToken = (user,statusCode,res)=>{
      const token = user.getJWTToken();

      // option for cookie 
       
      const options = {
        expires:new Date(
             Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true 
      };

      res.cookie("token",token,options).json({ 
        success:true,
        user,
        token
      }).status(statusCode);
      
}
module.exports = sendToken;
