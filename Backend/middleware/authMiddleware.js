require('dotenv').config();
const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

exports.verifyToken = async (request, h) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw Boom.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log("Tokens.", token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decode token", decoded);
        request.auth = decoded;
        return h.continue;
    } catch (error) {
        console.log("Token error", error.message);
        throw Boom.unauthorized('Invalid or expired token');
    }
};

exports.allowRoles = (...allowRoles) => {
    return async (request, h) => {
        const user = request.auth;
        console.log("User from token:", user.role);
        console.log("Allowed roles:", allowRoles);

        if (!allowRoles.includes(user.role)) {
            return h.response({ error: 'Access denied' }).code(403).takeover();
        }
        return h.continue;
    }
}
