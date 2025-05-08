import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

export {uri};