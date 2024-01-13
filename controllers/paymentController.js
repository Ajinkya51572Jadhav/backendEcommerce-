


 const catchAsyncError = require("../middleware/catchAsyncError");
                         //process.env.STRIPE_SECRET_KEY
 const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  
     exports.processPayment = catchAsyncError(async(req,res,next)=>{
  
        const myPayment = await stripe.paymentIntents.create({
                
                    amount : req.body.amount,
                    currency: "inr",
                    metadata : {
                    company : "Ecommerce",
                    },
                    });

                    res.json({
                        success : true ,
                        client_secret : myPayment.client_secret
                    }).status(200);
     }) ;

     
     exports.sendStripeApiKey = catchAsyncError(async(req,res)=>{
           res.json({
            // stripeApiKey : process.env.STRIPE_API_KEY
               stripeApiKey : process.env.STRIPE_API_KEY          
           }).status(200);
     });






