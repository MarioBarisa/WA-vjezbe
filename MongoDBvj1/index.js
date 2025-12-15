import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import fs from "fs";
import connectTodatabase from "./mongo.js";
import { FindCursor } from "mongodb";
const PORT = 3005;



app.listen(PORT, (error) => {
    if(error) {
        console.log("Greška prilikom pokretanja servera: ", error);
    }
    else {
        console.log(`Server je na portu ${PORT}`);
    }
    
});

let db = connectTodatabase();

let pizze_collection = await db.collection('pizze');
let pizze= pizze_collection.toArray();


app.get('/pizze', (req, res) => {
    res.send('Hello World');
});
