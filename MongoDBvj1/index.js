import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import fs from "fs";
const PORT = 3005;



app.listen(PORT, (error) => {
    if(error) {
        console.log("Greška prilikom pokretanja servera: ", error);
    }
    else {
        console.log(`Server je na portu ${PORT}`);
    }
    
});

import { connectToDatabase } from './mongo.js';
let db = await connectToDatabase();

let pizze_cursor = await db.collection('wa-test').find();
let pizze = await pizze_cursor.toArray();


app.get('/pizze', (req, res) => {
    res.json(pizze).status(200);
});


app.get('/pizze/:naziv', async (req, res) => {
    let pizze_collection = db.collection('wa-test');
    let nazivPizze = req.params.naziv;
    let pizza = await pizze_collection.find({ naziv: nazivPizze }).toArray();
    res.status(200).json(pizza);
});

app.post('/pizze', async (req, res) => {
    let pizze_collection = db.collection('wa-test');
    let novaPizza = req.body;
    let result = await pizze_collection.insertOne(novaPizza);
    res.status(201).send(`Uspješno dodana nova pizza: ${result.insertedId}`);
});

app.post('/narudzbe', async (req, res) => {
    const novaNarudzba = req.body;
    let narudzbe_collection = db.collection('narudzbe');
   // OBAVEZNI PODACI
    let obaveznniKljucevi = ['kupac', 'adresa', 'broj_telefona', 'narucene_pizze'];

    if (!obaveznniKljucevi.every(kljuc => Object.keys(novaNarudzba).includes(kljuc))) {
        return res.status(400).send("Nedostaju obavezni ključevi. ");
    }

  let obavezniKljuceviStavke = ['naziv', 'količina', 'velicina'];

  for (let stavka of novaNarudzba.narucene_pizze) {
      if (!obavezniKljuceviStavke.every((kljuc) => kljuc in stavka)) {
        return res
          .status(400)
          .json({ error: "Nedostaju obavezni ključevi u stavci narudžbe" });
      }
    } 

    try {
        let result = await narudzbe_collection.insertOne(novaNarudzba);
        res.status(201).json({
            insertedId: result.insertedId
        })
    }
    catch (error) {
        res.status(400).send("Greška u dodavanju narudžbe. ");
    }
});