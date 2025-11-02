const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

router.get('/slug/:slug', productController.getProductBySlug);
router.get('/search', productController.getProductByKeyword);
router.get('/id/:id', productController.getProductById);
router.get('/', productController.getProductList);
// router.post("/new", productController.createProduct);

module.exports = router;
