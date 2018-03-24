const express = require("express");
const router = express.Router();

// require modules
const productController = require("../controllers/productController");



router.get("/",  (req, res) => {
  res.status(200).json({
    message: "Hi welcome to NodeSchool Abuja😎"
  });
});


//product controllers
router.get("/products", productController.getAllProduct);
router.get("/products/:productId", productController.getOneProduct);
router.post("/products",   productController.createProduct);
router.patch("/products/:productId",   productController.updateProduct);
router.delete("/products/:productId",   productController.deleteProduct);


module.exports = router;
