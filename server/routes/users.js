import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  editProfile,
  getAllUsers,
} from "../controllers/users.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { verifyBlock, verifyToken } from "../middleware/auth.js";
import twilio from "twilio";
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
const accountSID = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const serviceSID = process.env.SERVICESID;
const client = twilio(accountSID, authToken);

router.get("/:id", verifyToken, verifyBlock, getUser);
router.patch("/:id/editProfile", verifyToken, editProfile);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

router.post("/mobile", async (req, res) => {
  try{
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
      client.verify.v2
        .services(serviceSID)
        .verifications.create({
          to: `+91${req.body.number}`,
          channel: "sms",
        })
        .then((resp) => {
          res.status(200).json(resp);
        })
        .catch((error) => {
          console.error('39 => ',error);
          res.status(500).json({ error: "Internal server error" });
        });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  
  }catch(error){
    console.log('erroror ',error) 
  }
});

router.post("/otp", (req, res) => {
  try {
    const { otp, number } = req.body;
    console.log("ssid ", serviceSID);
    client.verify.v2
      .services(serviceSID)
      .verificationChecks.create({
        to: `+91${number}`,
        code: otp,
      })
      .then((resp) => {
        console.log("otp res", resp);
        if (resp.valid) {
          User.findOne({ phoneNumber: number })
            .then((user) => {
              if (user) {
                const token = jwt.sign(
                  { id: user._id },
                  process.env.JWT_SECRET
                );
                delete user.password;
                return res.status(200).json({ token, user });
              } else {
                return res.status(404).json({ message: "User not found" });
              }
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            });
        } else {
          return res.status(403).json({ resp, message: "Invalid OTP" });
        }
      })
      .catch((err) => {
        console.log("error ", err);
        return res.status(500).json({ error: "Internal server error" });
      });
  } catch (err) {
    console.log("error ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
