const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

router.get('/all', productController.getProductList);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/search', productController.getProductByKeyword);
// router.post("/new", productController.createProduct);

module.exports = router;
