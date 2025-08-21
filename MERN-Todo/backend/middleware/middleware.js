import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'].split(' ')[1]
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'authorization not provided' });
        }
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'authorization not valid' });
            }
            req.user = decoded

            next()
        })
    } catch (error) {
        return res.status(401).json({ success: false, message: 'unauthorized' });
    }


    
}

export default authMiddleware