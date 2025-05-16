import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from "./config/db.js";
import { PORT, FRONTEND_ORIGIN } from "./config/serverConfig.js";

import apiRoutes from './routes/index.js';

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Social Media App");
});

app.use('/api', apiRoutes);


app.listen(PORT, async()=> {
    console.log(`Server started at PORT ${PORT}`);
    await connectDB();
})