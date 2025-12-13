import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import fs from "fs";
const PORT = 3005;

app.listen(PORT, (error) => {
    if(error) {
        console.log("Greška prilikom pokretanja servera: ", error);
    }
    else {
        console.log(`Server je na portu ${PORT}`);
    }
    
});

app.get("/zaposlenici", (req, res) => {
    fs.readFile('./data/zaposlenici.json', (err, data) => {
        if (err) {
            return res.status(404).send("Greška u čitanju");
        }
        
        let zaposlenici = JSON.parse(data);
        
        // pozicija
        if (req.query.pozicija) {
            zaposlenici = zaposlenici.filter(z => z.pozicija === req.query.pozicija);
        }
        
        // min god staž
        if (req.query.godine_staza_min) {
            const min = parseInt(req.query.godine_staza_min);
            zaposlenici = zaposlenici.filter(z => z.godine_staza >= min);
        }
        
        // max god staž
        if (req.query.godine_staza_max) {
            const max = parseInt(req.query.godine_staza_max);
            zaposlenici = zaposlenici.filter(z => z.godine_staza <= max);
        }
        
        // godine staža
        if (req.query.sortiraj_po_godinama) {
            if (req.query.sortiraj_po_godinama === 'uzlazno') {
                zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza);
            } else if (req.query.sortiraj_po_godinama === 'silazno') {
                zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza);
            }
        }
        
        res.status(200).json(zaposlenici);
    });
});


app.get("/zaposlenici/:id", (req, res) => {
    const idZaposlenika = parseInt(req.params.id);
    fs.readFile('./data/zaposlenici.json', (err, data) => {
        if (err) {
            res.status(404).send("Greška u čitanju");
        } else {
            const dataZaposenici = JSON.parse(data);
            if (idZaposlenika >= dataZaposenici.length || idZaposlenika < 0) {
                
                res.status(404).send("Zaposlenik nije pronađen")
                
            } else {
                res.status(200).json(dataZaposenici[idZaposlenika]);
            }
        }
    });
}); 

app.post('/zaposlenici', (req, res) => {
    const data = req.body;
    
    fs.readFile('./data/zaposlenici.json', (err, fileData) => {
        if (err) {
            return res.status(404).send("Greška u čitanju");
        }
        
        let dataZaposlenici = JSON.parse(fileData);
        dataZaposlenici.push(data);
        if (typeof data.id === "number" && typeof data.ime === "string" && typeof data.prezime === "string" &&
            typeof data.godine_staža === "number" && typeof data.pozicija === "string") {
                fs.writeFile('./data/zaposlenici.json', JSON.stringify(dataZaposlenici, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Greška prilikom pisanja u datoteku");
            }
            res.status(201).send("Zaposlenik uspješno dodan");
                });
        }
        else {
            res.status(400).send("Poslali ste krive vrste podataka.");
        }
        
    });
});
