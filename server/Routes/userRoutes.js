import express from 'express';
import {auth} from '../middlewares/auth.js'
import { getPublishedCreations, getuserCreations, toggleLikeCreations } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getuserCreations);
userRouter.get('/get-published-creation',auth,getPublishedCreations);
userRouter.post('/toggle-like-creation',auth,toggleLikeCreations);

export default userRouter;
