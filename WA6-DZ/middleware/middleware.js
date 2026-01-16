import filmovi from "../data/movies.js";
import glumci from "../data/actors.js";
import { ExpressValidator } from "express-validator";

const ProvjeraFilm = ((req, res, next) => {
    let filmId = parseInt(req.params.id);
    const film = filmovi.find(movie => filmId === movie.id);

    if (film) {
        res.status(200).send(film);
        next()
    } else {
        res.status(400).send("Film sa idejm ne postoji.")
    }
});


const ProvjeraGlumaca = (req, res, next) => {
    let actorId = parseInt(req.params.id);
    const actor = glumci.find(act => act.id === actorId)
    if (actor) {
        res.status(200).send(actor);
        next()
    }
    else {
        res.status(400).send("Actor sa ID-jem ne postoji.")
    }
};

const logger = (req, res, next) => {
    const timeStamp = new Date().toISOString();
    console.log("Vrijeme: ", timeStamp);
    console.log("Ruta", req.originalUrl);
    console.log(req.method);
    console.log(req.headers);
    console.log(req.body);
    next();
};

const provjeraIme = (req, res, next) => {
    const name = req.query.ime?.trim(); 
    if (typeof name === "string" && name.length > 0) {
        next();
    } else {
        res.status(400).send("Ime mora biti string.");
    }
};


export { ProvjeraFilm, ProvjeraGlumaca, logger, provjeraIme };