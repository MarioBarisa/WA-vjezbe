const checkDrink = (insert) => {
    if (!insert.naziv || !insert.cijena || !insert.zapremina || !insert.kolicina) {
        return false;
    }
    if (
        typeof insert.naziv !== 'string'
    ) {
        return false;
    }
    if (
        insert.naziv.length < 3 || insert.naziv.length > 50
    ) {
        return false;
    }
    if (
        typeof insert.cijena !== 'number' || insert.cijena < 0.5
    ) {
        return false;
    }
    if (
         typeof insert.kolicina !== 'number' || insert.kolicina < 49
    ) {
        return false;
    }
    else {
        return true;
    }
}

const validateDrink = (req, res, next) => {
    const data = req.body;

    if (Array.isArray(data)) {
        req.type = 'many';

        if (data.length === 0) {
            return res.status(400).send("Polje mora biti popunjeno")
        }
        for (let drink of data) {
            if (!checkDrink(drink)) {
                return res.status(400).send("nešto u array-u nije ok.")
            }
        }
    }
    else {
        req.type = 'one';
        if (!checkDrink(data)) {
            return res.status(400).send("Nešto je krivo u objektu");
        }
    }

    next();

};

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET); 

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};




export { validateDrink, authenticateToken };