const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
    
        if (!req.user) 
            return res.status(403).json({ message: 'Access denied. No user found.' });
        
        if (!req.user.roles) {
            return res.status(403).json({ message: 'Access denied. No user role found.' });
        }
        
        const userRole = req.user.roles;
        
        console.log(allowedRoles, userRole);
        
        let authorized = false;
        
        for (role of allowedRoles) {
            if (userRole.includes(role)) {
                authorized = true;
                break;
            }
        }
            
        if (!authorized)    
            return res.status(403).json({ message: 'Access denied. You do not have the required role.' });        

        next();
    };
}

module.exports = authorizeRoles;    