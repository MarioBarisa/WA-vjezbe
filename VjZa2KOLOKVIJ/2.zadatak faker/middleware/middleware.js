import express from "express";
const router = express.Router();

import { connectToDatabase } from "../db.js";
let db = await connectToDatabase();

import { ObjectId } from "mongodb"; 


const findUserById = async (req, res, next) => {
    let idFake = req.params.id;

    let faker_collection = db.collection('faker');
    
    try {
        let fake = await faker_collection.findOne({ _id: new ObjectId(idFake) });
        
        if (!fake) {
            return res.status(404).send("Korisnik nije pronađen.");
        }
        
        res.status(200).json(fake);
        req.user = fake;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Greška na serveru");
    }
};


export { findUserById };