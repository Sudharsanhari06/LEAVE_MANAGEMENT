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


