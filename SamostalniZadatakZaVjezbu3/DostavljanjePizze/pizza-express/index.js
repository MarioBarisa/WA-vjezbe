import express from 'express';
import cors from 'cors';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';

const corsOptions = {
    origin: 'http://localhost:5173'
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);    
                       


app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
    });

const PORT = 3000;
   
app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});
    

app.post('/api/narudzbe', (req, res) => {
    const { narucene_pizze, podaci_dostava } = req.body;
    
    // validacija
    if (!narucene_pizze || narucene_pizze.length === 0) {
        return res.status(400).json({
            uspjeh: false,
            poruka: 'Košarica je prazna. Molimo dodajte pizze.'
        });
    }
    
    if (!podaci_dostava || !podaci_dostava.prezime || !podaci_dostava.adresa || !podaci_dostava.telefon) {
        return res.status(400).json({
            uspjeh: false,
            poruka: 'Nedostaju podaci za dostavu.'
        });
    }
    
    // fake spremanje u bazu
    console.log('Nova narudžba primljena:');
    console.log('Pizze:', narucene_pizze);
    console.log('Dostava:', podaci_dostava);
    
    const ukupnaCijena = narucene_pizze.reduce((sum, pizza) => {
        return sum + (pizza.cijena * pizza.kolicina);
    }, 0);
    
    const narudzbaId = Math.floor(Math.random() * 10000);

    res.status(200).json({
        uspjeh: true,
        poruka: `Narudžba #${narudzbaId} je uspješno primljena! Dostava stiže za 30-45 minuta.`,
        narudzba_id: narudzbaId,
        ukupna_cijena: ukupnaCijena.toFixed(2),
        procijenjeno_vrijeme: '30-45 min'
    });
    
});

import { pizze } from './data/data.js';

app.get('/pizze/:naziv', (req, res) => {
    const naziv = req.params.naziv;
    const pizza = pizze.find(p => p.naziv.toLowerCase() === naziv.toLowerCase());
    
    if (!pizza) {
        return res.status(404).json({
            uspjeh: false,
            poruka: 'Pizza nije pronađena'
        });
    }
    
    res.status(200).json(pizza);
});





