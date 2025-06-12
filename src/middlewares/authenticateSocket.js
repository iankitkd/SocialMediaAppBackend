import jwt from 'jsonwebtoken';

import {JWT_SECRET} from '../config/serverConfig.js'

export const authenticateSocket = (socket, next) => {
    // this not possible as token is in http only cookie not able to send from client side
    // const token = socket.handshake.auth.token || socket.handshake.query.token

    const cookieHeader = socket.request.headers.cookie;
    console.log(cookieHeader, "ch")
    if (!cookieHeader) {
        console.log("no cookie")
        return next(new Error('No cookies sent'));
    }
    
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
    const token = cookies['token'];
    if (!token) {
        console.log("no token")
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
