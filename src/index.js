import express from "express";

import connectDB from "./config/db.js";

const PORT = 3000;
const app = express();


app.listen(PORT, async()=> {
    console.log(`Server started at PORT ${PORT}`);
    await connectDB();
})