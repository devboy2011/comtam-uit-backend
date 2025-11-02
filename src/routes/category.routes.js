const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categories.controller');

router.get('/', categoryController.getCategoryList);
// router.post('/', categoryController.createCategory);

module.exports = router;
