import filmovi from "../data/movies.js";
import glumci from "../data/actors.js";

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


export { ProvjeraFilm, ProvjeraGlumaca };