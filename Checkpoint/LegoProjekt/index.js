
import express from "express";
let app = express();
const router = express.Router();

app.use(express.json());                           
app.use(express.urlencoded({ extended: true }));
app.use(router);                                   



const PORT = 3005;

app.listen(PORT, (error) => {
    if (error) {
        console.error("Greška prilikom pokretanja servera:", error);
    }
    else {
        console.log("Server sluša na portu", PORT);
    }
})

let legoFigurice = [
    { id: 1, naziv: "Pirate", cijena: 12.00 },
    { id: 2, naziv: "Astronaut", cijena: 15.50 },
    { id: 3, naziv: "Knight", cijena: 10.00 },
    { id: 4, naziv: "Ninja", cijena: 14.00 },
    { id: 5, naziv: "Robot", cijena: 20.00 },
    { id: 6, naziv: "Wizard", cijena: 18.00 },
    { id: 7, naziv: "Explorer", cijena: 16.00 },
    { id: 8, naziv: "Samurai", cijena: 14.50 },
    { id: 9, naziv: "Alien", cijena: 19.00 },
    { id: 10, naziv: "Cyborg", cijena: 22.00 }
];

let legoKocke = [
    { id: 1, naziv: "Basic Brick", cijena: 0.10 },
    { id: 2, naziv: "Window", cijena: 0.50 },
    { id: 3, naziv: "Door", cijena: 0.75 },
    { id: 4, naziv: "Wheel", cijena: 1.00 },
    { id: 5, naziv: "Roof Tile", cijena: 0.30 },
    { id: 6, naziv: "Arch Brick", cijena: 0.40 },
    { id: 7, naziv: "Round Brick", cijena: 0.25 },
    { id: 8, naziv: "Slope Brick", cijena: 0.35 },
    { id: 9, naziv: "Plate", cijena: 0.15 },
    { id: 10, naziv: "Corner Brick", cijena: 0.20 }
];

let legoPosebneKocke = [
    { id: 1, naziv: "Minifigure Head", cijena: 2.00 },
    { id: 2, naziv: "Printed Tile", cijena: 3.50 },
    { id: 3, naziv: "Technic Beam", cijena: 4.00 },
    { id: 4, naziv: "Hinge Brick", cijena: 2.50 },
    { id: 5, naziv: "Transparent Brick", cijena: 1.75 },
    { id: 6, naziv: "Glow-in-the-Dark Brick", cijena: 5.00 },
    { id: 7, naziv: "Flexible Tube", cijena: 3.00 },
    { id: 8, naziv: "Gear", cijena: 4.50 },
    { id: 9, naziv: "Ball Joint", cijena: 3.75 },
    { id: 10, naziv: "Decorative Element", cijena: 6.00 }
];


app.get("/", (req, res) => {
    console.log("Pozvan je GET ruta ");
    res.send("Pozdrav");
})

router.get("/figurice", (req, res) => {
    return res.status(200).json(legoFigurice);
});
 
router.get("/figurice/:naziv", (req, res) => {
    const figuricaNaziv = req.params.naziv;
    const trazenaFigurica = legoFigurice.find(fig => fig.naziv.toLowerCase() === figuricaNaziv.toLowerCase());

    if (!trazenaFigurica) {
        return res.status(404).json({error: "Figurica nije pronađena."})
    }
    else {
        return res.status(200).json(trazenaFigurica);
    }
});
 
router.post("/figurice", (req, res) => {
    const { id, naziv, cijena } = req.body;

    if (!id || !naziv || !cijena) {
        return res.status(400).json({ error: "Nedostaju podaci za kreiranje figurice." });
    }

    legoFigurice.push({ id: parseInt(id), naziv: naziv, cijena: parseFloat(cijena) });
    return res.status(201).send("Uspješno dodana nova figurica.");
});

router.delete("/figurice/:id", (req, res) => {

    const figID = parseInt(req.params.id);

    const index = legoFigurice.findIndex(fig => fig.id === figID);
    if (index === -1) {
        return res.status(400).send("Figurica ne postoji.");
    }
    else {
        legoFigurice.splice(index, 1);
        return res.status(200).send("Figurica sa ID " + figID + " je obrisana.");
    }

 });
