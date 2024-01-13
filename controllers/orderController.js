const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Errorhander = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create New Order 

exports.newOrder = catchAsyncError(async(req,res,next)=>{
    
const { 
  shippingInfo ,
  orderItems,
  paymentInfo,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice} = req.body;

const order = await Order.create(
{
shippingInfo ,
orderItems,
paymentInfo,
itemsPrice,
taxPrice,
shippingPrice,
totalPrice,
paidAt:Date.now(),
user:req.user._id
});

res.json({
    success:true,
    order
}).status(201);


});


// Get Single Order 
   
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
         const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
         );

         if(!order){
            return next(new Errorhander("Order Not Found With This Id",400));
         }

         res.json({
           success:true,
           order
         }).status(200)
});


// Get logged in user Orders 
   
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});

    res.json({
      success:true,
      orders
    }).status(200);
});


// Get All User -----(Admin)
   
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0 ;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.json({
      success:true,
      totalAmount,
      orders
    }).status(200)
});


// // update Order Status --- Admin

//      exports.updateOrder = catchAsyncError(async(req,res,next)=>{
//       const order= await Order.findById(req.params.id);


//       if(!order){
//         return next( new Errorhander("Order Not Found With This Id",404))
//      }

//       if(order.orderStatus === "Deliverd"){
//           return  next(new Errorhander("You Have Already delivered this order",400));
//       }

//       order.orderItems.forEach(async(o)=>{
//          await updateStock(o.product,o.quantity)
//       });
         
//       order.orderStatus = req.body.status;

//       if(req.body.status === "Delivered"){
//           order.deliveredAt = Date.now();
//       }
//                 await order.save({validateBeforeSave:false});
            
//            res.json({
//                 success:true
//            }).status(200)

//      })

    

//         async function updateStock(id,quantity){
//                 const product = await Product.findById(id);
//                  product.Stock= quantity;                        

//                  await product.save({validateBeforeSave:false});
//         }


        

// update Order Status -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new Errorhander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}






// Get All User -----(Admin)
   
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
  const orders = await Order.find();

  let totalAmount = 0 ;

  orders.forEach((order)=>{
      totalAmount+=order.totalPrice
  })

  res.json({
    success:true,
    totalAmount,
    orders
  }).status(200)
});

        // delete Order -- Admin 

            exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
               const order = await Order.findById(req.params.id);

               if(!order){
                  return next( new Errorhander("Order Not Found With This Id",404))
               }
                  await order.deleteOne();

                  res.json({
                    success:true
                  }).status(200);

            });


























































































































































































































































































































































































































































































































