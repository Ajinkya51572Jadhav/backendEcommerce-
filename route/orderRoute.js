const express = require("express");
const { newOrder, 
        myOrders,
        getSingleOrder, 
        getAllOrders, 
        updateOrder, 
        deleteOrder,} = require("../controllers/orderController");
        
const router = express.Router();
          
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth");  //     authorizeRoles

router.route("/order/new").post(newOrder);  

router.route("/order/:id").get(getSingleOrder);  

router.route("/orders/me").get(isAuthenticatedUser,myOrders);  

router.route("/admin/orders").get(isAuthenticatedUser,getAllOrders); //authorizeRoles("admin"),

router.route("/admin/order/:id")
.put(isAuthenticatedUser,updateOrder)  // authorizeRoles("admin"),
.delete(isAuthenticatedUser,deleteOrder); //authorizeRoles("admin"),





module.exports = router ; 


