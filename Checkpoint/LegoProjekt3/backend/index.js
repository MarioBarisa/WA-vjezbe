import cors from 'cors';
import express from "express";
const app = express();
import { connectToDatabase } from './mongo.js';
import createLegoRoutes from "./routes/legoRoutes.js";
import { registracijaKorisnika, prijavaKorisnika } from './services/authService.js';
import { body, validationResult } from 'express-validator';

app.use(express.json());                           
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3005;

async function startServer() {
    try {
        
        let db = await connectToDatabase();
        app.use(createLegoRoutes(db));

        app.post('/register', 
            [
                body('username').notEmpty().withMessage('Korisničko ime je obavezno'),
                body('email').isEmail().withMessage('Email nije valjan'),
                body('password').isLength({ min: 6 }).withMessage('Lozinka mora imati minimalno 6 znakova')
            ],
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                try {
                    const { username, email, password, role } = req.body;
                    const noviKorisnik = await registracijaKorisnika(username, email, password, role);
                    
                    return res.status(201).json({ 
                        message: 'Korisnik uspješno registriran',
                        korisnik: {
                            id: noviKorisnik._id,
                            username: noviKorisnik.username,
                            email: noviKorisnik.email,
                            role: noviKorisnik.role
                        }
                    });
                } catch (error) {
                    return res.status(400).json({ message: error.message });
                }
            }
        );

        app.post('/login',
            [
                body('username').notEmpty().withMessage('Korisničko ime je obavezno'),
                body('password').notEmpty().withMessage('Lozinka je obavezna')
            ],
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                try {
                    const { username, password } = req.body;
                    const { token, korisnik } = await prijavaKorisnika(username, password);

                    return res.status(200).json({
                        message: 'Uspješna prijava',
                        token: token,
                        korisnik: {
                            id: korisnik._id,
                            username: korisnik.username,
                            role: korisnik.role
                        }
                    });
                } catch (error) {
                    return res.status(401).json({ message: error.message });
                }
            }
        );

        
        app.listen(PORT, () => {
            console.log("Server sluša na portu", PORT);
        });

    } catch (error) {
        console.error("Greška:", error);
        process.exit(1);
    }
}


startServer();
