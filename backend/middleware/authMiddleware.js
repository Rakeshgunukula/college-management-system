const jwt = require('jsonwebtoken')

const authMiddleware = (req,res, next) => {
    const token = req.headers.authorization;
    if(!token){
        console.log('header:' + token)
       return res.status(401).json({msg:'No Token Found'});
    }
    try{
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    }catch(err) {
        return res.status(401).json({msg:'Invalid Token'});
    }
}

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
           return res.status(401).json({msg: 'Access Denied'});
        }

        next()
    }
}

module.exports = {authMiddleware, roleMiddleware}