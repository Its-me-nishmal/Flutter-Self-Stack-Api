import { verify } from 'jsonwebtoken';
import { User } from '../models/userModel.js'; 

const auth = async (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = verify(token, 'this-for-self-stack-api');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user' });
        }

        req.user = user
        next();
    } catch (error) {
        next(error)
    }
};

export default auth;
