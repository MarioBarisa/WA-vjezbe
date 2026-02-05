import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = 'test'; 

export const autorizacijaMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Token nije pronađen' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token nije valjan' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.korisnik = decoded;
        
        return next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Token nije valjan ili je istekao' });
    }
};

// Admin middleware
export const adminMiddleware = (req, res, next) => {
    if (req.korisnik.role !== 'admin') {
        return res.status(403).json({ message: 'Pristup dozvoljen samo administratorima' });
    }
    return next();
};


export const dohvatiKorisnika = async (req) => {
    try {
        const users = global.db.collection('users');
        const korisnik = await users.findOne({ 
            _id: new ObjectId(req.korisnik.id) 
        });
        return korisnik;
    } catch (error) {
        throw new Error('Korisnik nije pronađen');
    }
};
