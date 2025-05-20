import jwt from 'jsonwebtoken';

import {JWT_SECRET} from '../config/serverConfig.js'

export const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ 
            message: 'Not authorized, token missing' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            message: 'Token invalid' 
        });
    }
};

export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (error) {

    }
  } else {
    req.user = {id: null, email: null};
  }
  next();
};