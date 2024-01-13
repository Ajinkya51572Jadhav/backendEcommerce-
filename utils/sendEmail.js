const nodemailer = require("nodemailer");

const sendEmail = async(options)=>{
    console.log("options",options);
 
    const transporter = nodemailer.createTransport({
        service:process.env.SMPT_SERVICE,
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,      
        secure :true,              
       
              auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
           }
    })
    console.log(transporter);

    const mailOptions = {
         form:process.env.SMPT_MAIL, 
         to: options.email, 
         subject:options.subject,
         text:options.message
         }

     await transporter.sendMail(mailOptions);
   
   
}
module.exports = sendEmail ; 


