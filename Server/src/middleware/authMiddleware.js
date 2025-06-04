import jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (request, h) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw Boom.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        request.auth = decoded;  
        return h.continue;
    } catch (err) {
        throw Boom.unauthorized('Invalid or expired token');
    }
};

export const allowRoles = (...rolesAllowed) => {
    return async (request, h) => {
        const user = request.auth;

        if (!rolesAllowed.includes(user.role)) {
            return h.response({ error: 'Access denied' }).code(403).takeover();
        }

        return h.continue;
    };
};
