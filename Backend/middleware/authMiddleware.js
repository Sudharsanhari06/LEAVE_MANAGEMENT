require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyToken = async (request, h) => {
   
    try {
        const token = request.headers.authorization?.split(" ")[1];
        
        if (!token) {
            throw new Error("No token provided");
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        request.auth=decoded;
        return h.continue;
    }
    catch (error) {
        return ({message:"Unathorized"}).code(401).takeover();
    }
}

exports.allowRoles= (...allowRoles)=>{
    return async(request,h)=>{
        const role=request.auth?.role;
        if(!allowRoles.includes(role)){
            return h.response({error:'Access denied'}).code(403).takeover();
        }
        return h.continue;
    }
}


