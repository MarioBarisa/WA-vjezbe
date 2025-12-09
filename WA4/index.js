import { error } from "console";
import express from "express";
import fs from 'fs';
const app = express();


app.get("/", (req, res) => {
  res.status(200).send("Vrijeme je za čitanje datoteka!");
});


function read_lorem(callback) {
    fs.readFile("./data/lore_ipsum.txt", "utf-8", callback);
}

app.get('/lorem', (req, res) => {
    read_lorem((error, data) => {
        if (error) {
            res.status(404).console.log("Greška");
        }
        else {
            res.status(200).send(data);
        }
  }) 
});

app.get('/lorem-promise', async (req, res) => {
    try {
        let data = await fs.promises.readFile("./data/lore_ipsum.txt", "utf-8");
        res.status(200).send(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
  console.log("Poslužitelj je pokrenut na portu 3000");
});
