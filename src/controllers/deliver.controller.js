const User = require('../models/user.model');

exports.getAllDelivery = async (req, res) => {
    try{
        const userId = req.user.userId;
        
        const user = await User
            .findOne({ _id: userId }, { address: 1});
        
        if (!user.address || user.address.length === 0) {
            return res.status(200).json({ message: 'No delivery addresses found' });
        }
            
        return res.status(200).json({
            message: 'Delivery addresses retrieved successfully',
            body: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error' })
    }
}

exports.createDelivery = async (req, res) => {
    try{
        const userId = req.user.userId;
        
        const {street, ward, city, tele} = req.body;

        if (!street || !ward || !city || !tele) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        let user = await User.findOne({ _id: userId }, { address: 1 });
        if (user.address.length === 0) {
            await user.address.push({ street, ward, city, tele, isDefault: 1 });
        } else {
            await user.address.push({ street, ward, city, tele });
        }
       
        await user.save();

        return res.status(201).json({
            message: 'Delivery address created successfully',
            // return the newly added address
            body: user.address[user.address.length - 1],
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error' })
    }
}

exports.deleteDelivery = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = req.params.id;
        
        const user = await User
            .findOne({ _id: userId }, { address: 1});
            
        if (user.address.length === 0) {
            return res.status(404).json({ 
                error: 'No delivery addresses found' 
            });
        }

        const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ 
                error: 'Address not found' 
            });
        }

        user.address.splice(addressIndex, 1);
        await user.save();

        return res.status(200).json({ 
            message: 'Address deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal error' })
    }
}

exports.updateDelivery = async (req, res) => {
    try{
        const userId = req.user.userId;
        const addressId = req.params.id;
        const { city, ward, street, tele } = req.body;

        if (!addressId || !city || !ward || !street || !tele) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        
        const user = await User
            .findOne({ _id: userId }, { address: 1});
        
        if (user.address.length === 0) {
            return res.status(404).json({ 
                error: 'No delivery addresses found' 
            });
        }
        
        const addressIndex = user.address
            .findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404)
                .json({ error: 'Address not found' });
        }    
        
        user.address[addressIndex].city = city;
        user.address[addressIndex].ward = ward;
        user.address[addressIndex].street = street;
        user.address[addressIndex].tele = tele;
        
        await user.save();
        
        return res.status(200).json({
            message: 'Delivery address updated successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error' })
    }
}

exports.setDefaultDelivery = async (req, res) => {
    try{
        const userId = req.user.userId;
        const addressId = req.params.id;

        if (!addressId) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        
        const user = await User
            .findOne({ _id: userId }, { address: 1});
        
        if (user.address.length === 0) {
            return res.status(404).json({ 
                error: 'No delivery addresses found' 
            });
        }
        
        const addressIndex = user.address
            .findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404)
                .json({ error: 'Address not found' });
        }    
        
        user.address.forEach(addr => addr.isDefault = false);
        user.address[addressIndex].isDefault = true;
        
        await user.save();
        
        return res.status(200).json({
            message: 'Delivery set as default successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error' })
    }
}