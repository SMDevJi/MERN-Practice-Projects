import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { registerValidationRules } from '../validators/authValidator.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router()


router.post('/register', registerValidationRules, async (req, res) => {
    try {
        let { name, email, password } = req.body
        email = email.toLowerCase()

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(400).json({ success: false, message: "This email is already registered." })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await User.create({
            name, email, password: hashedPassword
        })

        return res.status(200).json({ success: true, message: "User registered successfully." })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }


})


router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body
        email = email.toLowerCase()

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "User is not registered." })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials." })
        }

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRESIN,
        })

        return res.status(200).json({ success: true, authorization: token })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }


})


export default router