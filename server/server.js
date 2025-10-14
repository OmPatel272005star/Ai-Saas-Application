import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './Routes/aiRoutes.js';
import userRouter from './Routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
await connectCloudinary();
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())


app.get('/om',(req,res)=>{
  console.log("om");
  res.send('Server is Live!');
});

//app.use(requireAuth());
app.use('/api/ai',aiRouter)
app.use('/api/user',userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
})