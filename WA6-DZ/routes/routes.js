import express from "express";

const router = express.Router();

import filmovi from "../data/movies.js";
import glumci from "../data/actors.js";
import { ProvjeraFilm, ProvjeraGlumaca } from "../middleware/middleware.js";


router.get('/movies', (req, res) => {
    res.status(200).send(filmovi);
});


router.get('/movies/:id',ProvjeraFilm ,(req, res) => {

});


router.post('/movies', (req, res) => {
    const data = req.body;
    if (data) {
        filmovi.push(data);
        res.status(200).send("Uspješno dodan film");
    }
    else {
        res.status(400).send("Greška u dodavanju.");
    }
});

router.patch('/movies/:id', (req, res) => {
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

router.get('/actors', (req, res) => {
    res.status(200).send(glumci);
});


router.get('/actors/:id', ProvjeraGlumaca,(req, res) => {

});


router.post('/actors', (req, res) => {
    const data = req.body;
    if (data) {
        glumci.push(data);
        res.status(200).send("Uspješno dodan glumac.");
    }
    else {
        res.status(400).send("Niste poslali info.")
    }
});

router.patch('/actors/:id', (req, res) => {
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


export default router;