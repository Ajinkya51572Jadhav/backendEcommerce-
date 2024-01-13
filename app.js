const express = require("express");
 const app = express();
 const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const helmet  = require("helmet");
const errorMiddleware = require("./middleware/error");
const dotenv = require("dotenv");
const path = require("path");

   app.use(helmet());
   app.use(express.json());
   app.use(cookieParser());
   app.use(bodyParser.urlencoded({extended:true}));
   app.use(fileUpload());
   app.use(cors());

   

        //     config 
       dotenv.config({path:"./config/config.env"});

      // Route Imports 

   const product = require("./route/productRoute");
   const user = require("./route/userRoute");
   const order = require("./route/orderRoute");
   const payment = require('./route/paymentRoute');

   app.use("/api/v1",product);
   app.use("/api/v1",user);
   app.use("/api/v1",order);
   app.use("/api/v1",payment);
         


   // app.use(express.static(path.join(__dirname, "../fronted/build")));
   // app.get("*", (req, res) => {
   //   res.sendFile(path.resolve(__dirname, "../fronted/build/index.html"));
   //   res.sendFile(path.resolve(__dirname, "../fronted/public/index.html"));
   //   console.log(path.resolve(__dirname, "../fronted/public/index.html"))
   // });





   // Middleware  for Error 
   app.use(errorMiddleware);

 module.exports = app



//  controllers/
//         index.js
//         middleware/
//         models/
//         package-lock.json
//         package.json
//         router/
//         utils/