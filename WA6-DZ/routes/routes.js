import express from "express";

const router = express.Router();


import filmovi from "../data/movies.js";
import glumci from "../data/actors.js";
import { ProvjeraFilm, ProvjeraGlumaca, provjeraIme } from "../middleware/middleware.js";
import { check, validationResult,query } from "express-validator";


router.get('/movies', [
    query('min_year').optional().isInt().withMessage('min_year mora biti integer!'),
    query('max_year').optional().isInt().withMessage('max_year mora biti integer!')], (req, res) => {
    
    
        const minYear = req.query.min_year ? parseInt(req.query.min_year, 10) : undefined;
        const maxYear = req.query.max_year ? parseInt(req.query.max_year, 10) : undefined;
    
        const filmovii = filmovi.filter(movie => {
            if (minYear !== undefined && movie.year < minYear) return false;
            if (maxYear !== undefined && movie.year > maxYear) return false;
            return true;
        });
    
        return res.status(200).json(filmovii);
});


router.get('/movies/:id', [
    ProvjeraFilm,
    check('id').isInt().withMessage('Niste poslali int!'),
 ],(req, res) => {

});


router.post('/movies', [

    check('title').trim().notEmpty().escape().withMessage('Niste poslali sve title!'),
    check('year').trim().notEmpty().escape().withMessage('Niste poslali year!'),
    check('genre').trim().notEmpty().escape().withMessage('Niste poslali sve genre!'),
    check('director').trim().notEmpty().escape().withMessage('Niste poslali sve dirctora!')

] ,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    filmovi.push(req.body);
    return res.status(200).send('Uspješno dodan film');
  
});

router.patch('/movies/:id', [

    check('title').trim().notEmpty().escape().withMessage('Niste poslali sve title!'),
    check('year').trim().notEmpty().escape().withMessage('Niste poslali year!'),
    check('genre').trim().notEmpty().escape().withMessage('Niste poslali sve genre!'),
    check('director').trim().notEmpty().escape().withMessage('Niste poslali sve dirctora!')

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

/*
router.get('/actors', (req, res) => {
    res.status(200).send(glumci);
}); */

router.get('/actor', provjeraIme, (req, res) => {
    const ime = req.query.ime;
    const error = validationResult(req);
    if (error.isEmpty()) {
        const glumac = glumci.find(glum => glum.name.trim().toLowerCase() === ime.trim().toLowerCase())
        if (glumac) {
            res.status(200).json(glumac);
        }
        else {
            res.status(400).send("Glumac ne postoji."); 
        }
    }
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