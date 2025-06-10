import jwt from 'jsonwebtoken';

import {JWT_SECRET} from '../config/serverConfig.js'

export const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token

    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
};
