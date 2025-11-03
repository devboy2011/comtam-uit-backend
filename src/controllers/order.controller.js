const Order = require('../models/order.model');
const Cart = require('../models/carts.model');
const Products = require('../models/products.model');
const User = require('../models/user.model');

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const myOrders = await Order.find({ user_id: userId })
        .sort({ createdAt: -1 });

        if (!myOrders || myOrders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.status(200).json({
            message: "Orders retrieved successfully",
            body: myOrders,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
}

exports.getOrderById = async (req, res) => {
    try{
        const userId = req.user.userId;
        const orderId = req.params.id;
        
        const order = await Order.find({ _id: orderId, user_id: userId });
        
        if (!order) {
            return res.status(404).json({ 
                message: "Order not found" 
            });
        }

        return res.status(200).json({
            message: "Order retrieved successfully",
            body: order,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
}

exports.createOrder = async (req, res) => {
    try{
        const userId = req.user.userId;
        const { products, delivery, note } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({ 
            error: "No products provided" 
        });
        }

        if (!delivery) {
            return res.status(400).json({
                error: "Invalid delivery information"
            });
        }
        
        const user = await User.findOne({ _id: userId }, { address: 1 });
        
        const deliveryReq = user.address.find(addr => addr._id.toString() === delivery);
        if (!deliveryReq) {
            return res.status(400).json({
                error: "Delivery address not found"
            });
        }
        
        delete deliveryReq.isDefault;
        delete deliveryReq.createdAt;
        delete deliveryReq._id;

        let total = 0;
        let amount = 0;
        
        let productList = [];
        
        for (const product of products) {
            total += product.quantity;
            const dataProduct = await Products.findOne({ id: product.id });
            
            if (!dataProduct) {
                return res.status(404).json({
                    error: `Product with ID ${product.id} not found`
                });
            }
            if (product.quantity < 0 ) {
                return res.status(400).json({
                    error: `Invalid quantity for product with ID ${product.id}`
                });
            }
            if (dataProduct.remained < product.quantity) {
                return res.status(400).json({
                    error: `Not enough stock for product with ID ${product.id}`
                });
            }
            
            amount += product.quantity * dataProduct.price;
            productList.push({ product_id: product.id, quantity: product.quantity });
        }
        
        const newOrder = new Order({
            user_id: userId,
            products: productList,
            total,
            amount,
            delivery: deliveryReq,
            note
        });

        try {
             await newOrder.save();
        }
        catch (err) {
            console.log(err);
            return  res.status(500).json({ error: "Failed to create order" });
        }

        for (const product of productList) {
            await Cart.updateOne({ user_id: userId, "products.product_id": product.product_id }, { $inc: { "products.$.quantity": -product.quantity } });
            await Products.updateOne({ id: product.product_id }, { $inc: { remained: -product.quantity } });
        }

        return res.status(201).json({
            message: "Order created successfully",
            body: newOrder,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
}