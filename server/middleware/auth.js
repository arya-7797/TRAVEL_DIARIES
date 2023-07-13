import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/User.js";

dotenv.config();
export const verifyToken = async (req, res, next) => {
  try {
    console.log('token ',token);
    let token = req.header("Authorization");
    if (!token) {
      return res.status(405).send("Access Denied invalid token");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verii ',verified)
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message+', token verification error' });
  }
};

export const verifyBlock = async (req, res, next) => {
  try {
    console.log('verify block')
    let token = req.header("Authorization");
    if (!token) {
      return res.status(405).send("Access Denied");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('*********** ',req.user.id)
    const user = await User.findById(Object(req.user.id))
    if(!user || user.Block) return res.status(405).send("You are blocked");  

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
