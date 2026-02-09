import express from "express";
const router = express.Router();

import { connectToDatabase } from "../db.js";
let db = await connectToDatabase();

import { ObjectId } from "mongodb"; 


import { fa, faker } from "@faker-js/faker";
function createRandomUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

router.post('/fake', async (req, res) => {
    const data = createRandomUser();
    let faker_collection = db.collection('faker');

    try {
        faker_collection.insertOne(data);
        res.status(200).send("Uspješno dodan fake korisnik.");
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/fake', async (req, res) => {
    let limit = parseInt(req.query.limit);
    let faker_collection = db.collection('faker');
    let fake = await faker_collection.find().limit(limit).toArray();
    try {
        res.status(200).json(fake);
    } catch (error) {
        res.sta(404).sedn(error);
    }
});

router.get('/fake/:id', async (req, res) => {
    let idFake = req.params.id;

    let faker_collection = db.collection('faker');
    
    try {
        let fake = await faker_collection.findOne({ _id: new ObjectId(idFake) });
        
        if (!fake) {
            return res.status(404).send("Korisnik nije pronađen.");
        }
        
        res.status(200).json(fake);
    } catch (error) {
        console.error(error);
        res.status(500).send("Greška na serveru");
    }
});

router.delete('/fake/:id', async (req, res) => {
    let idFake = req.params.id;
    let faker_collection = db.collection('faker');
    
    try {
        let result = await faker_collection.deleteOne({ _id: new ObjectId(idFake) });
        
        if (!result) {
            return res.status(404).send("Korisnik nije pronađen.");
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Greška na serveru");
    }
});



export default router;


