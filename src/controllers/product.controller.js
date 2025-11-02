const Product = require('../models/products.model');
const  removeAccents = require('../utils/removeAccent.js') ;

exports.getProductList = async (req, res) => {    
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const limit = parseInt(req.query.limit) || 10; // Số lượng sự kiện mỗi trang
        const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua`
        
        const{category } = req.query;
        const filter = {};
        
        if (category){
            const raw = Array.isArray(category) ? category : [category];
            filter['category_list.category_id'] = { $in: raw.map(item => parseInt(item)) };
        }
        
        const  productList = await Product
            .find(filter, {name: 1, id: 1, img: 1, price: 1, slug: 1, remained: 1, desc: 1, 'category_list.category_id': 1, _id: 0})
            .skip(skip)
            .limit(limit)
            
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        
        if (!productList || productList.length === 0){
            return res.status(200).json({ 
                message: 'No product found',
                body: []
            });
        }

        res.status(200).json({
            message: 'Products retrieved successfully',
            body: productList,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}

exports.getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product retrieved successfully',
            body: product,
        });
    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}

exports.getProductByKeyword = async (req, res) => {
    try {
        const { keySearch } = req.query;
        
        console.log('Key Search:', keySearch);

        const normalizedKeySearch = removeAccents(keySearch);
        
        const regexSearch = new RegExp(keySearch, 'i'); // 'i' for case-insensitive
        const normalizedRegexSearch = new RegExp(normalizedKeySearch, 'i');

        const products = await Product.find(
            {
                $or: [
                    { name: regexSearch },
                    { desc: regexSearch },
                    { nameNonAccent: normalizedRegexSearch },
                    { descNonAccent: normalizedRegexSearch }
                ]
            },
            { name: 1, id: 1, img: 1, price: 1, slug: 1, remained: 1, desc: 1, 'category_list.category_id': 1, _id: 0 }
        );

        if (!products || products.length === 0) {
            return res.status(200).json({
                message: 'No product found',
                body: []
            });
        }

        res.status(200).json({
            message: 'Products retrieved successfully',
            body: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Service not supported" });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { name, price, desc, category_list, slug } = req.body;

        const newProduct = await Product.create({ name, price, desc, slug, category_list });

        res.status(201).json({
            message: 'Product created successfully',
            body: newProduct,
        });
    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product retrieved successfully',
            body: product,
        });
    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}