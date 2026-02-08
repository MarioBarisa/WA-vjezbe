import express from "express";
const router = express.Router();

import { connectToDatabase } from '../db.js';
import { ObjectId } from "mongodb";
import { validateDrink } from "../middleware/middleware.js";
import { body } from "express-validator";
let db = await connectToDatabase();


let pocetnoDrinks = [
  {
    naziv: "Coca-Cola",
    zapremina: 0.2,
    cijena: 4.5,
    kolicina: 100,
  },

  {
    naziv: "Fanta",
    zapremina: 0.2,
    cijena: 4.5,
    kolicina: 100,
  },

  {
    naziv: "7up",
    zapremina: 0.2,
    cijena: 4.5,
    kolicina: 100,
  }
];

router.post('/pocetnoDrinks', async (req, res) => {
    let drinks_collection = db.collection('drinks');
    try {
        await drinks_collection.deleteMany({});
        let result = await drinks_collection.insertMany(pocetnoDrinks);
        res.status(200).json({ insertedCount: result.insertedCount });
    } catch (error) {
        res.status(400).send(error)
    }
});


//naziv - obavezan, tipa string , minimalne duljine 3 znaka, a maksimalne duljine 50 znakova.
//zapremina - obavezna, tipa number , minimalne vrijednosti 0.1 .
//cijena - obavezna, tipa number , minimalne vrijednosti 0.5 .
//kolicina - obavezna, tipa number , minimalne vrijednosti 50 .

router.post('/drinks', async (req, res) => {
    let drinks = db.collection('drinks');
    let insert = req.body;
    if (!insert.naziv || !insert.cijena || !insert.zapremina || !insert.kolicina) {
        return res.status(200).send("Niste poslali sve potrebne informacije.")
    }
    if (
        typeof insert.naziv !== 'string'
        ) {
            return res.status(400).send("Naziv mora biti string")
        }
    if (
        insert.naziv.length<3 || insert.naziv.length>50
    )   {
          return  res.status(400).send("Naziv mora biti između 3 i 50 slova!")
        }
    if (
        typeof(insert.cijena)!="number" || insert.cijena<0.5
    )
    {
       return res.status(400).send("Cijena mora bit broj i veča od 0.5");
    }
    if (
        insert.kolicina===null || typeof insert.kolicina !== 'number' || insert.kolicina<49
    ) 
    {
        return res.status(400).send("Krivi podaci o kolicini.")
    }
    
    else {
        try {
            let result = await drinks.insertOne(insert);
            res.status(200).send("Uspješno dodavanje");
        }
        catch (error) {
            res.status(400).send(error);
        }
    }
})

router.post('/drinksMany', [validateDrink],async (req, res) => {
    let drinks = req.body;
    let drinks_collection = db.collection('drinks');
    let result; //?????????

    try {
        if (req.type === 'one') {
            result = await drinks_collection.insertOne(drinks);
           return res.status(200).send({ message: "Uspješno dodano", insertedCount: result.insertedCount || 1 });
        }
        else {
            result = await drinks_collection.insertMany(drinks);
           return res.status(200).send({ message: "Uspješno dodano", insertedCount: result.insertedCount || 1 });
        }

    } catch (error) {
      return  res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})



router.get('/drinks', async (req, res) => {
  
    try {
        let drinks_collection = db.collection('drinks');
        let drinks = await  drinks_collection.find().toArray();
        res.status(200).send(drinks);
    } catch (error) {
        res.status(400).send(error);
        
    }
});


router.get('/drinks/:id', async (req, res) => {
    let drinks_collection = db.collection('drinks');
    let drinkID = req.params.id;
    try {
        let drink = await drinks_collection.findOne({ _id: new ObjectId(drinkID) });
        if (!drink) {
            return res.status(404).send("Pice ne postoji.")
        }
        else {
            return res.status(200).json(drink);
        }
    } catch (error) {
        return res.status(400).send("Greška ID ili server error");
    }
});


export default router;