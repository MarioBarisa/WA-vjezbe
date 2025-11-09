
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

let legoSetovi = [
    { id: 1, naziv: "Set 1", kocka: legoKocke[0], figurica: legoFigurice[1], posebnaKocka: legoPosebneKocke[2] },
    {id: 2, naziv: "Set 2", kocka: legoKocke[4], figurica: legoFigurice[2], posebnaKocka: legoPosebneKocke[3] },
]


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


// ------ KOCKE

router.get("/legoKocke", (req, res) => {
    return res.status(200).json(legoKocke);
});
 
router.put("/legoKocke/", (req, res) => {
    const idKocke = req.body.id;
    const kocka = req.body; 

    let index = -1
    index = legoKocke.findIndex(kocka => kocka.id === parseInt(idKocke));

    if (index === -1) {
        return res.status(404).json({ error: "Kocka nije pronađena." });
    }
    else {
        legoKocke[index].cijena = kocka.cijena;
        legoKocke[index].naziv = kocka.naziv;
        return res.status(200).send("Uspješno ažurirana kocka nzaiva: " + kocka.naziv);
    }
});


router.patch("/legoKocke/promjenaEUR/:id", (req, res) => {
    
    const idKocke = parseInt(req.params.id);
    const novaCijenaEUR = req.body.cijenaEUR;

    let index = -1;
    index = legoKocke.findIndex(kocka => kocka.id === idKocke);

    if (index === -1) {
        return res.status(404).send("Kocka sa ID " + idKocke + " nije pronađena.");
    }
    else {
        legoKocke[index].cijena = novaCijenaEUR;
        return res.status(200).send("Uspješno ažurirana cijena kocke sa ID " + idKocke + " na " + novaCijenaEUR + " EUR.");
    }

});

router.patch("/legoKocke/promjenaNaziva/:id", (req, res) => {
    let idKocke = -1;
    idKocke = parseInt(req.params.id);

    const noviNaziv = req.body.naziv;

    if (idKocke === -1) {
        return res.status(404).send("Kocka sa ID " + idKocke + " nije pronađena.");
    }
    else {

        let index = -1;
        index = legoKocke.findIndex(kocka => kocka.id === idKocke);
        
        legoKocke[index].naziv = noviNaziv;

        return res.status(200).send("Uspješno ažuriran naziv kocke sa ID " + idKocke + " na " + noviNaziv + ".");
        
    }
});


router.post("/legoKocke", (req, res) => {

    const novaKocka = req.body;
    const index = legoKocke.length;

    if (!novaKocka.naziv || !novaKocka.cijena) {
        return res.status(400).send("Nedostaju podaci za kreiranje kocke.");
    }
    else {

        legoKocke.push(
            { id: index+1 , naziv: novaKocka.naziv, cijena: parseFloat(novaKocka.cijena) }
        )
        return res.status(200).send("Uspješno dodana nova kocka.");
        
    }
})

//--------- Lego Setovi


router.get("/legoSetovi", (req, res) => {
 
    const nazivSeta = req.body.naziv;

    if(!nazivSeta){
        return res.status(200).json(legoSetovi);
    }
    else {
        const trazeniSet = legoSetovi.findIndex(set => set.naziv.toLowerCase() === nazivSeta.toLowerCase());
        if(trazeniSet === -1){
            return res.status(404).json({ error: "Set nije pronađen." });
        }
        else {
            return res.status(200).json(legoSetovi[trazeniSet]);
        }
        
    }
});
 

router.post("/legoSetovi", (req, res) => {
    
    const noviSet = req.body;

    if(!noviSet.naziv || !noviSet.kocka || !noviSet.figurica || !noviSet.posebnaKocka){
        return res.status(400).send("Nedostaju podaci za kreiranje seta.");
    }
    else {
        const index = legoSetovi.length;
        legoSetovi.push(
            {
                id: index + 1, naziv: noviSet.naziv,
                kocka: legoKocke[noviSet.kocka-1],
                figurica: legoFigurice[noviSet.figurica-1],
                posebnaKocka: legoPosebneKocke[noviSet.posebnaKocka-1],
                cijena: noviSet.cijena
            }
        )
        return res.status(200).send("Uspješno dodan novi set.");
    }

})


router.delete("/legoSetovi/:id", (req, res) => { 

    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).send("Navedite ID seta za brisanje.");
    }
    else {
        const index = legoSetovi.findIndex(set => set.id === id);
        if (index === -1) {
            return res.status(404).send("Set nije pronađen.");
        }
        else {
            legoSetovi.splice(index, 1);
            return res.status(200).send("Set sa ID " + id + " je obrisan.");
        }
    }

});
