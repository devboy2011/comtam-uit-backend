const Category = require('../models/category.model');

exports.getCategoryList = async (req, res) => {    
    try {
        const categories = await Category.find({}, { category_id: 1, name: 1, img: 1, _id: 0 });

        res.status(200).json({
            message: 'Categories retrieved successfully',
            body: categories,
        });
    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}

exports.createCategory = async (req, res) => {
    try {
        const { name, img } = req.body;

        const newCategory = await Category.create({ name, img });

        res.status(201).json({
            message: 'Category created successfully',
            body: newCategory,
        });
    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}