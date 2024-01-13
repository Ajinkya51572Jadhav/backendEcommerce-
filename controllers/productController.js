const Errorhander = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

const Product = require("../models/productModel");

// Create product __ Admin 

exports.createProduct= catchAsyncError(async(req,res,next)=>{

let images = [];

 if(typeof(req.body.images==="string")){
    images.push(req.body.images);
 }else{
    images = req.body.images; 
 };

      const imagesLinks = [];
      for(let i=0; i < images.length; i++){
           const result = await cloudinary.v2.uploader.upload(images[i],{
              folder:"products",                                                                                                   
           });

           imagesLinks.push({
            public_id : result.public_id,
            url : result.secure_url,  
      });

      };
    
           
  
              req.body.images = imagesLinks;
              req.body.user   = req.user.id ; 
              

     const product = await Product.create(req.body);
         res.json({
            success:true,
            product
         }).status(201);
});





// Get All Product

exports.getAllproducts = catchAsyncError(async(req,res,next)=>{
   
   const resultPerPage = 8;
   const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(),req.query) 
  .search()
  .filter()

  let products = await apiFeature.query;
  
   let filteredProductsCount = products.length;
     
  apiFeature.pagination(resultPerPage);
    
   // products = await apiFeature.query;
     
    res.json({
        success:true,
        products,
        productsCount ,
        resultPerPage ,
        filteredProductsCount      
     }).status(200);

});




// Get All Product ______ (Admin)

exports.getAdminProducts = catchAsyncError(async(req,res,next)=>{
   
   const products = await Product.find();

    res.json({
        success:true,
        products 
      }).status(200);

});








//Get Product Details 

exports.getProductDetails =catchAsyncError(async(req,res,next)=>{

   const product =  await Product.findById(req.params.id)
         //  console.log("request",req.body.id);
   if(!product){
      return next(new Errorhander("Product Not Found ",404));       
      // return res.json({
      //    success:false,
      //    message:"Product Not Found"
      // }).status(500);
   }

    res.json({
       success:true,
       product
    }).status(200)


   })


// Update Product -- Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
   let product = await Product.findById(req.params.id);
 
   if (!product) {
     return next(new Errorhander("Product not found", 404));
   }
 
   // Images Start Here
   let images = [];
 
   if (typeof(req.body.images === "string")) {
     images.push(req.body.images);
   } else {
     images = req.body.images;
   }
 
   if (images !== undefined) {
     // Deleting Images From Cloudinary
     for (let i = 0; i < product.images.length; i++) {
       await cloudinary.v2.uploader.destroy(product.images[i].public_id);
     }
 
     const imagesLinks = [];
 
     for (let i = 0; i < images.length; i++) {
       const result = await cloudinary.v2.uploader.upload(images[i], {
         folder: "products",
       });
 
       imagesLinks.push({
         public_id: result.public_id,
         url: result.secure_url,
       });
     }
 
     req.body.images = imagesLinks;
   }
 
   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
     runValidators: true,
     useFindAndModify: false,
   });
 
   res.json({
     success: true,
     product,
   }).status(200);
 });



//  Delete  Product 

exports.deleteProduct= catchAsyncError(async(req,res,next)=>{
 
    const  product = await Product.findById(req.params.id);
            
    if(!product){
       return res.json({
          success:false,
          message:"Product Not Found"
       }).status(500);
    }

        // Deleting Image From Cloudinary
      
        for(let i=0;i< product.images.length;i++){
         await cloudinary.v2.uploader.destroy(product.images[i].public_id);

        }

     await product.deleteOne();

     res.json({
        success:true,
        message:"Product Delete Successfully"
     }).status(200)

   }); 




// Create New Review or Update The Review 

exports.createProductReview = catchAsyncError(async(req,res,next)=>{
 
   const {rating,comment , productId} = req.body;
       
   const review = {
     user:req.user._id,
     name:req.user.name,
     rating:Number(rating),
     comment
   }
   
    const product = await Product.findById(productId);

     const isReviewed = product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString()); 

      if(isReviewed){
   product.reviews.forEach((rev)=>{
       if(rev.user.toString()===req.user._id.toString())     
         (rev.rating = rating),(rev.comment = comment);       
   })                 
      }else{
         product.reviews.push(review);
         product.numOfReviews = product.reviews.length
      }

       let avg = 0;
       product.reviews.forEach((rev)=>{
        avg+=rev.rating;
   })
   
   product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.json({success:true}).status(200);      

})


//  Get All Reviews of a Product

    exports.getProductReviews = catchAsyncError(async(req,res,next)=>{
         const product = await Product.findById(req.query.id);

          if(!product){
             return next(new Errorhander("Product Not Found",404));
          }

          res.json({
            success:true,
            reviews:product.reviews
          }).status(200);

    });


// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Errorhander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

         
 

       
       



















