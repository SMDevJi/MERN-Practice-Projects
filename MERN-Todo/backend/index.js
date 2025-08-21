import express from 'express'
import dotenv from 'dotenv';
import connectToDB from './db/db.js';
import User from './models/User.js'
import authRouter from './routes/auth.js'
import noteRouter from './routes/note.js'
dotenv.config();

const app = express()
app.use(express.json())


app.use('/api/auth',authRouter)
app.use('/api/note',noteRouter)



app.get('/', async (req, res) => {
    res.status(200).json({ status: 'running' })
})

app.listen(process.env.API_PORT, () => {
    connectToDB()
    console.log(`Server listening on port: ${process.env.API_PORT}`)
})





// jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: '7d',
//   })

// res.json({ user: { id: user._id, username, email }, token });

// req.user = await User.findById(decoded.id).select('-password');