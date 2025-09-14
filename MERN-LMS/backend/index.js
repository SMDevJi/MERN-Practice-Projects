import express from 'express'
import dotenv from 'dotenv';
import connectToDB from './db/db.js';
import User from './models/User.js'
import authRouter from './routes/auth.js'
import profileRouter from './routes/profile.js'
import courseRouter from './routes/course.js'
import cloudinaryRouter from './routes/cloudinary.js'
import paymentRouter from './routes/payment.js'
import feedbackRouter from './routes/feedback.js'

import cors from 'cors'
dotenv.config();

const app = express()
app.use('/api/payment/confirm', express.raw({ type: 'application/json' }));

app.use(express.json())

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(corsOptions))

app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/course',courseRouter)
app.use('/api/cloudinary',cloudinaryRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/feedback',feedbackRouter)



app.get('/', async (req, res) => {
    res.status(200).json({ status: 'running' })
})

app.listen(process.env.API_PORT, () => {
    connectToDB()
    console.log(`Server listening on port: ${process.env.API_PORT}`)
})




