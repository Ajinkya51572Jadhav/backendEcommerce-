const  app =  require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");


// Unhandled unCaugth   Exception

process.on("uncaughtException",(err)=>{
    console.log("Error",err.message);
    console.log("Shutting down the Server due to Uncaugth   Exception ");
    process.exit(1);


})


// //     config 
dotenv.config({path:"/config/config.env"});
require("dotenv").config({ path: "backend/config/config.env" });

// // Config
// if (process.env.NODE_ENV !== "Production"){
//     require("dotenv").config({ path: "backend/config/config.env" });
//   }


//  connecting to database 
 connectDatabase();
 
 cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key    : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
 }) 


const server =  app.listen(process.env.PORT,()=>{
console.log("localhost connected is",process.env.PORT);
})


// Unhandled Promise Rejection

   process.on("unhandledRejection",(err)=>{
    console.log("Error",err.message);
    console.log("Shutting down the Server due  to Unhandled Promise Rejection");

    server.close(()=>{
    process.exit(1);
})   

})


//  backend api   https://backend-f6n5wrdlp-ajinkya51572jadhav.vercel.app/