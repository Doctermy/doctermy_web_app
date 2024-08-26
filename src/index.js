import express from "express";
const app = express();
import connectToMongodb from "./configs/db.config.js";
import indexMiddleware from './middlewares/index.middleware.js';

import { config } from "dotenv";
config();
const PORT = process.env.PORT || 2004;

indexMiddleware(app);

app.listen(PORT, () => {
  connectToMongodb();
  console.log(`App is currently running on port ${PORT}!`);
})