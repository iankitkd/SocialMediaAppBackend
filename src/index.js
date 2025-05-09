import express from "express";

import connectDB from "./config/db.js";
import { PORT } from "./config/serverConfig.js";

import apiRoutes from './routes/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);


app.listen(PORT, async()=> {
    console.log(`Server started at PORT ${PORT}`);
    await connectDB();
})