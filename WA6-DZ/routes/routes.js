import express from "express";

const router = express.Router();


import filmovi from "../data/movies.js";
import glumci from "../data/actors.js";
import { ProvjeraFilm, ProvjeraGlumaca } from "../middleware/middleware.js";
import { check, validationResult } from "express-validator";


router.get('/movies', (req, res) => {
    res.status(200).send(filmovi);
});


router.get('/movies/:id', [
    ProvjeraFilm,
    check('id').isInt().withMessage('Niste poslali int!')
 ],(req, res) => {

});


router.post('/movies', [

    check('title').notEmpty().withMessage('Niste poslali sve podatke!'),
    check('year').notEmpty().withMessage('Niste poslali sve podatke!'),
    check('genre').notEmpty().withMessage('Niste poslali sve podatke!'),
    check('director').notEmpty().withMessage('Niste poslali sve podatke!')

] ,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    filmovi.push(req.body);
    return res.status(200).send('Uspješno dodan film');
  
});

router.patch('/movies/:id', [

    check('title').notEmpty().withMessage('Niste poslali sve podatke!'),
    check('year').notEmpty().withMessage('Niste poslali sve podatke!'),
    check('genre').notEmpty().withMessage('Niste poslali sve podatke!'),
    check('director').notEmpty().withMessage('Niste poslali sve podatke!')

],(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        else {
            const data = req.body;
    let filmId = parseInt(req.params.id);
    const index = filmovi.findIndex(movie=> movie.id===filmId)
    if (!index) {
        filmovi[index] = data;
        res.status(200).send("Uspješno patchan film. ")
    } else {
        res.status(400).send("Film sa idejm ne postoji.")
    }
    }
    
});

router.get('/actors', (req, res) => {
    res.status(200).send(glumci);
});


router.get('/actors/:id', [ProvjeraGlumaca,check('id').isInt().withMessage('Niste poslali int!')],(req, res) => {

});


router.post('/actors', [
    check('name').notEmpty().withMessage("Niste poslali sve."),
    check('birthYear').notEmpty().withMessage("Niste poslali sve.")], (req, res) => {
    const data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
    if (errors) {
        glumci.push(data);
        res.status(200).send("Uspješno dodan glumac.");
    }
    else {
        res.status(400).send("Niste poslali info.")
    }
});

router.patch('/actors/:id', [
    check('name').notEmpty().withMessage("Niste poslali sve."),
    check('birthYear').notEmpty().withMessage("Niste poslali sve.")] ,(req, res) => {
    const data = req.body;
    let actorId = parseInt(req.params.id);
    const actorIndex = glumci.findIndex(ind => actorId === ind);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    if (actorIndex) {
        glumci[actorIndex] = data;
        res.status(200).send("Uspješno ažuriran glumac.")
    }
    else {
        res.status(400).send("Niste poslali dobar data.");
    }
});


export default router;