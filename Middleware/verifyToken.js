const jwt = require('jsonwebtoken')

//This Middleware verify JWT token
const verify=async(req,res,next) => {
    
    try {
        
        const token = req.cookies.jwtToken;
        const obj =await jwt.verify(token, process.env.jwtKEY);
        req.body.ClientID=obj.ClientID
        
        next()
    }
    catch (err)
    {
        res.status(498).json({
            message:err
        })
    }

}
module.exports=verify