const jwt = require('jsonwebtoken')

//This Middleware verify JWT token
const verify=async (req,res,next) => {
    
    try {
        // console.log(req.cookie)
        // const token = req.cookies.access_token;
        const token = req.cookies.jwtToken;
        
        console.log("token in verify file -   " +token);
        const obj =await jwt.verify(token, process.env.jwtKEY);
        console.log(obj);
        req.body.ClientID=obj.ClientID
        
        next()
    }
    catch (err)
    {
        console.log(err)
        res.status(555).json({
            message:err
        })
    }

}
module.exports=verify