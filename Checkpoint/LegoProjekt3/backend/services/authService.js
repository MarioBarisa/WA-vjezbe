import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "test"; 
const SALT_ROUNDS = 10;


function getUsersCollection() {
    if (!global.db) {
        throw new Error('Database nije povezana');
    }
    return global.db.collection('users');
}

export const registracijaKorisnika = async (username, email, password, role = 'korisnik') => {
    try {
        const users = getUsersCollection();
        
        // korisnik postoji?
        const postojeciKorisnik = await users.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (postojeciKorisnik) {
            throw new Error('Korisnik već postoji');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const noviKorisnik = {
            username,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date()
        };

        const result = await users.insertOne(noviKorisnik);
        noviKorisnik._id = result.insertedId;
        
        return noviKorisnik;
        
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Korisnik već postoji');
        }
        throw error;
    }
};

export const prijavaKorisnika = async (username, password) => {
    try {
        const users = getUsersCollection();
        const korisnik = await users.findOne({ username });
        
        if (!korisnik) {
            throw new Error('Neispravno korisničko ime ili lozinka');
        }

        const isPasswordValid = await bcrypt.compare(password, korisnik.password);
        if (!isPasswordValid) {
            throw new Error('Neispravno korisničko ime ili lozinka');
        }
        const token = jwt.sign(
            { 
                id: korisnik._id.toString(), 
                username: korisnik.username,
                role: korisnik.role 
            },
            JWT_SECRET,
            { expiresIn: '72h' }
        );

        return { token, korisnik };
        
    } catch (error) {
        throw error;
    }
};
