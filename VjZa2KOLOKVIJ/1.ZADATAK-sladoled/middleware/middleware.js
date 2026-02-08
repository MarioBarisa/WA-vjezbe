const checkDrink = (insert) => {
    if (!insert.naziv || !insert.cijena || !insert.zapremina || !insert.kolicina) {
        return false;
    }
    if (
        typeof insert.naziv !== 'string'
    ) {
        return false;
    }
    if (
        insert.naziv.length < 3 || insert.naziv.length > 50
    ) {
        return false;
    }
    if (
        typeof insert.cijena !== 'number' || insert.cijena < 0.5
    ) {
        return false;
    }
    if (
         typeof insert.kolicina !== 'number' || insert.kolicina < 49
    ) {
        return false;
    }
    else {
        return true;
    }
}

const validateDrink = (req, res, next) => {
    const data = req.body;

    if (Array.isArray(data)) {
        req.type = 'many';

        if (data.length === 0) {
            return res.status(400).send("Polje mora biti popunjeno")
        }
        for (let drink of data) {
            if (!checkDrink(drink)) {
                return res.status(400).send("nešto u array-u nije ok.")
            }
        }
    }
    else {
        req.type = 'one';
        if (!checkDrink(data)) {
            return res.status(400).send("Nešto je krivo u objektu");
        }
    }

    next();

};

export { validateDrink };