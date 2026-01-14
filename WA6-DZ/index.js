import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3005;

import filmovi from "./data/movies.js";
import glumci from "./data/actors.js";

app.listen(PORT, (error) => {
    if(error) {
        console.log("Greška prilikom pokretanja servera: ", error);
    }
    else {
        console.log(`Server je na portu ${PORT}`);
    }
    
});


app.get('/movies', (req, res) => {
    res.status(200).send(filmovi);
});


app.get('/movies/:id', (req, res) => {
    let filmId = parseInt(req.params.id);
    const film = filmovi.find(movie => filmId === movie.id);
    if (film) {
        res.status(200).send(film);
    } else {
        res.status(400).send("Film sa idejm ne postoji.")
    }
});


app.post('/movies', (req, res) => {
    const data = req.body;
    if (data) {
        filmovi.push(data);
        res.status(200).send("Uspješno dodan film");
    }
    else {
        res.status(400).send("Greška u dodavanju.");
    }
});

app.patch('/movies/:id', (req, res) => {
    const data = req.body;
    let filmId = parseInt(req.params.id);
    const index = filmovi.findIndex(movie=> movie.id===filmId)
    if (!index) {
        filmovi[index] = data;
        res.status(200).send("Uspješno patchan film. ")
    } else {
        res.status(400).send("Film sa idejm ne postoji.")
    }
});

app.get('/actors', (req, res) => {
    res.status(200).send(glumci);
});

app.get('/actors/:id', (req, res) => {
    let actorId = parseInt(req.params.id);
    const actor = glumci.find(act => act.id === actorId)
    if (actor) {
        res.status(200).send(actor)
    }
    else {
        res.status(400).send("Actor sa ID-jem ne postoji.")
    }
});


app.post('/actors', (req, res) => {
    const data = req.body;
    if (data) {
        glumci.push(data);
        res.status(200).send("Uspješno dodan glumac.");
    }
    else {
        res.status(400).send("Niste poslali info.")
    }
});

app.patch('/actors/:id', (req, res) => {
    const data = req.body;
    let actorId = parseInt(req.params.id);
    const actorIndex = glumci.findIndex(ind => actorId === ind);
    if (actorIndex) {
        glumci[actorIndex] = data;
        res.status(200).send("Uspješno ažuriran glumac.")
    }
    else {
        res.status(400).send("Niste poslali dobar data.");
    }
});