import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

import { clerkMiddleware } from '@clerk/express';
import aiRouter from './Routes/aiRoutes.js';
import userRouter from './Routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

dotenv.config();
await connectCloudinary();

const app = express();

// ------------ 1️⃣ CORS only for development -------------
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json());
app.use(clerkMiddleware());

// ------------ 2️⃣ API ROUTES (backend) -------------
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

// -------------------------------------------------------
// 3️⃣ SERVE FRONTEND FILES FROM dist/ IN PRODUCTION
// -------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static dist folder
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback: return React index.html for all routes
app.get("{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// -------------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
