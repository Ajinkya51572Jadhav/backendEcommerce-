const express = require("express");
const { getAllproducts ,
        createProduct ,
        updateProduct,
        deleteProduct,
        getProductDetails, 
        createProductReview, 
        getProductReviews,
        deleteReview,
        getAdminProducts} = require("../controllers/productController");

        const { isAuthenticatedUser ,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllproducts); 

router.route("/admin/products").get( isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);  //  authorizeRoles("admin"),

router.route("/admin/product/new").post( isAuthenticatedUser,authorizeRoles("admin"),createProduct); //  authorizeRoles("admin"),

router.route("/admin/product/:id")
.put( isAuthenticatedUser,authorizeRoles("admin"), updateProduct) //  authorizeRoles("admin"),
.delete( isAuthenticatedUser,authorizeRoles("admin"),  deleteProduct);  //authorizeRoles("admin"),

router.route("/product/:id").get(getProductDetails);

router.route("/review").put( isAuthenticatedUser,createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);

module.exports = router;    
