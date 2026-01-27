import express from "express";

const router = express.Router();

import { faker } from "@faker-js/faker";
import { connectToDatabase } from "../mongo.js";
import { body, query, param, check, validationResult } from 'express-validator';
import { ObjectId } from "bson";

const db = connectToDatabase(); 

function createRandomUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

router.get("/faker", (req, res) => {
    let user = createRandomUser();
    res.status(200).send(user);
});

router.post('/faker', async (req, res) => {
    let db = await connectToDatabase();
    let vjezba = db.collection('kolokvij2');
        try {
            let reasult = await vjezba.insertOne(createRandomUser())
            res.status(200).json({ insertedCount: reasult.insertedCount });
        } catch (error) {
            res.status(400).send(error)
        }
})


router.get('/users/:id', [param("id").notEmpty().isString().isLength({min: 24, max:24})],async (req, res) => {
    
    const errors = validationResult(req);
    if (errors.isEmpty()){
        const id = req.query.id;
        const collection = db.collection("kolokvij2");
        let users = collection().find().toArray();
        res.json(users).status(200);
    }
    else {
        res.status(400).send("Greška u validaciji.")
    }
    


})


export default router;
