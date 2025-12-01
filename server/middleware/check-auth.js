const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorizatrion.split(" ")[1]; //Auth: 'Bearer token'
        if (!token) {
        throw new Error('Authentication failed');
        }
        const decoded = jwt.verify(token, 'SecretMoot');
        req.userData = { id: decoded.id };
        next();
    }catch(err){
        return res.status(401).json({ message: 'Authentication failed' });
    }
    
   

};
