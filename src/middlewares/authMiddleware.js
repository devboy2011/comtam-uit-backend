const jwt = require('jsonwebtoken');

const { jwtSecret, jwtExpiresIn } = require('../configs/jwt.config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    } 

    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
        return res.status(401).json({ error: 'Failed to authenticate token' });
        }
    
        req.user = decoded;
        next();
    });
}

module.exports = authMiddleware;