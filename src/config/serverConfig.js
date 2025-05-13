import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const MONGODB_URI = process.env.MONGODB_URI;

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export {MONGODB_URI, PORT, SALT_ROUNDS, JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_ORIGIN};