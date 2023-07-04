import express from 'express';
import { verifyToken } from "../middleware/auth.js";
import {createGroup,getGroups} from '../controllers/chat.js';

const router = express.Router();
 
router.post('/group',verifyToken,createGroup);
router.get('/group',verifyToken,getGroups);
  

export default router;
