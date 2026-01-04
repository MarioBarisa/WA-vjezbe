import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
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
 
router.put("/legoKocke/:id", (req, res) => {
    const idKocke = parseInt(req.params.id);
    const kocka = req.body; 

    if (idKocke != null) {
        res.status(404).send("Niste poslali broj.")
    }
    else {

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

        const index = legoSetovi.findIndex(set => set.id === id);
        if (index === -1) {
            return res.status(404).send("Set nije pronađen.");
        }
        else {
            legoSetovi.splice(index, 1);
            return res.status(200).send("Set sa ID " + id + " je obrisan.");
        }

});


export default router;