import express from "express";
const app = express();
app.use(express.json());


import pizzeRoutes from '../routes/pizze.js';
app.use("/pizze", pizzeRoutes);

const PORT = 3005;

app.listen(PORT, error => {
    if (error) {
        console.error("Error starting server:", error);
    }
    else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
})

const pizze = [
    { id: 1, naziv: 'Margherita', cijena: 6.5 },
    { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
    { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
    { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
    { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
];
    
router.get("/", (req, res) => {
    res.json(pizze).status(200);
})

router.get("/:naziv", (req, res) => {

    if(!req.params.naziv){
        res.send("Naziv pizze je obavezan").status(400);
        return;
    }

    const naziv = req.params.naziv;
    const pizzaTrazena = pizze.find(pizza => pizza.naziv.toLowerCase() === naziv.toLowerCase());
     
    if (!pizzaTrazena) {
        res.send("Pizza nije pronađena").status(404);
    }
    else {
        res.send(pizzaTrazena).status(200);
    }
})

router.post("/pizze", (req, res) => {
    const novaPizza = req.body;
    const Nid = pizze.at(-1)["id"] + 1;
    
    const dozvoljeni_kljucevi = ["naziv", "cijena"];
    const novaPizza_kljucevi = Object.keys(novaPizza);
    console.log(novaPizza_kljucevi);
    console.log(dozvoljeni_kljucevi);


    const novi_zapis = {
        id: Nid,
        naziv: novaPizza.naziv,
        cijena: novaPizza.cijena
    }

    pizze.push(novi_zapis);
    res.send("Pizza je dodana").status(201);
})