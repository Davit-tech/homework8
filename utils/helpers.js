
import jwt from 'jsonwebtoken';

const {USER_AUTH_SECRET} = process.env;

export default {
    createToken(userId) {
        return jwt.sign({userId}, USER_AUTH_SECRET, {expiresIn: '1d'});
    },

    verifyToken(token) {
        try {
            return jwt.verify(token, USER_AUTH_SECRET);
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }
};
