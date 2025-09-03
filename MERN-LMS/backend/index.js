import express from 'express'
import dotenv from 'dotenv';
import connectToDB from './db/db.js';
import User from './models/User.js'
import authRouter from './routes/auth.js'
import profileRouter from './routes/profile.js'
import cloudinaryRouter from './routes/cloudinary.js'
import cors from 'cors'
dotenv.config();

const app = express()
app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions))

app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/cloudinary',cloudinaryRouter)



app.get('/', async (req, res) => {
    res.status(200).json({ status: 'running' })
})

app.listen(process.env.API_PORT, () => {
    connectToDB()
    console.log(`Server listening on port: ${process.env.API_PORT}`)
})




