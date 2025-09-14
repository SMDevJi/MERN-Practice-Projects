import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { registerValidationRules } from '../validators/authValidator.js';
import { validationResult } from 'express-validator';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import authMiddleware from "../middleware/middleware.js";
dotenv.config();

const router = express.Router()
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

router.post('/register', registerValidationRules, async (req, res) => {
    try {
        let { name, email, password, isOauth, picture,isTutor } = req.body
        email = email.toLowerCase()

        if (!isOauth) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: errors.array()[0].msg });
            }
        }



        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(400).json({ success: false, message: "This email is already registered." })
        }

        let hashedPassword;
        if (!isOauth) {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        } else {
            hashedPassword = ""
        }


        await User.create({
            name, email, password: hashedPassword, isOauth, picture,isTutor
        })

        return res.status(200).json({ success: true, message: "User registered successfully." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error." })
    }


})


router.post('/login', async (req, res) => {
    try {
        let { email, password, token, isOauth,isTutor } = req.body;
        email = email.toLowerCase();

        //oauth login logic
        if (isOauth && token) {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.OAUTH_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            email = payload.email;

            const userToReturn = await User.findOne({ email });
            if (!userToReturn) {
                return res.status(400).json({ success: false, message: "User not found" });
            }
            if(userToReturn.isTutor!=isTutor){
                return res.status(400).json({ success: false, message: `Please login as ${userToReturn.isTutor?'tutor':'student'}` });
            }
            const jwtToken = jwt.sign({
                id: userToReturn._id,
                name: userToReturn.name,
                email: userToReturn.email,
                isOauth: userToReturn.isOauth,
                picture: userToReturn.picture,
                enrolledCourses: userToReturn.enrolledCourses,
                isTutor:userToReturn.isTutor
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });

            return res.status(200).json({ success: true, authorization: jwtToken });
        }

        // Normal login (Email,password)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if(user.isTutor!=isTutor){
            return res.status(400).json({ success: false, message: `Please login as ${user.isTutor?'tutor':'student'}` });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const newToken = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            isOauth: user.isOauth,
            picture: user.picture,
            enrolledCourses: user.enrolledCourses,
            isTutor:user.isTutor
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });

        return res.status(200).json({ success: true, authorization: newToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});




router.post('/reissue-token',authMiddleware, async (req, res) => {
    try {
        const email=req.user.email
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }


        const newToken = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            isOauth: user.isOauth,
            picture: user.picture,
            enrolledCourses: user.enrolledCourses,
            isTutor:user.isTutor
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });

        return res.status(200).json({ success: true, authorization: newToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


export default router