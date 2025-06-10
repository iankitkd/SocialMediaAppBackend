import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';

import connectDB from "./config/db.js";
import { setupSocket } from "./socket/socket.js";
import { PORT, FRONTEND_ORIGIN } from "./config/serverConfig.js";

import apiRoutes from './routes/index.js';

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send("Social Media App");
});

app.use('/api', apiRoutes);


setupSocket(server);

server.listen(PORT, async()=> {
    console.log(`Server started at PORT ${PORT}`);
    await connectDB();
})