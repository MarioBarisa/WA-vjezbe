
const trazenaFigurica = async (req, res, next) => {
    const figuricaNaziv = req.params.naziv;
    const collection = global.db.collection("figurice");
    const legoFigurice = await collection.find().toArray();
    const trazenaFigurica = legoFigurice.find(
        (fig) => fig.naziv.toLowerCase() === figuricaNaziv.toLowerCase()
    );

    if (!trazenaFigurica) {
        return res.status(404).json({ error: "Figurica nije pronađena." });
    } else {
        return res.status(200).json(trazenaFigurica);
    }
};


const legoFiguriceGET = async (req, res, next) => {
    try {
        const collection = global.db.collection("figurice");
        const kocke = await collection.find().toArray();
        return res.status(200).json(kocke);
      } catch (error) {
        return res.status(400).send("Nešto nije OK u /figurice endpointu.");
      }
}

const legoKockeGET = async (req, res, next) => {
    try {
        const collection = global.db.collection("kocke");
        const legoKocke = await collection.find().toArray();
        res.status(200).json(legoKocke);
    } catch (error) {
        
        res.status(400).send("Došlo je do greške");
      
    }
   
}


const legoKockeIDPUT = async (req, res, next) => {
    const idKocke = parseInt(req.params.id);
    const kocka = req.body;

      const collection = global.db.collection("kocke");
      const legoKocke = await collection.find().toArray();
      let index = -1;
      index = legoKocke.findIndex((kocka) => kocka.id === parseInt(idKocke));

      if (index === -1) {
        return res.status(404).json({ error: "Kocka nije pronađena." });
        
      } else {
        const collection = global.db.collection("kocke");
        const result = await collection.updateOne(
          { id: idKocke },
          { $set: { cijena: kocka.cijena, naziv: kocka.naziv } }
        );
        return res
          .status(200)
          .send("Uspješno ažurirana kocka nzaiva: " + kocka.naziv);
      }
    
}

const postKocke = async (req, res, next) => {
    const collection = db.collection("kocke");
    const legoKocke = await collection.find().toArray();


const novaKocka = req.body;
const index = legoKocke.length+1;

if (!novaKocka.naziv || !novaKocka.cijena) {
  return res.status(400).send("Nedostaju podaci za kreiranje kocke.");
} else {
    await db.collection("kocke").insertOne({
        id: index,
        naziv: novaKocka.naziv,
        cijena: parseFloat(novaKocka.cijena),
    });
  return res.status(200).send("Uspješno dodana nova kocka.");
}
}

const getLegoPosebne = async (req, res, next) => {
    try {
        const collection = global.db.collection("legoPosebneKocke");
        const legoKocke = await collection.find().toArray();
        res.status(200).json(legoKocke);
    } catch (error) {
        
        res.status(400).send("Došlo je do greške");
      
    }
}


const legoPosebneGT = async (req, res, next) => {
    const filterCijena = parseFloat(req.params.cijena);
    try {
      const collection = db.collection("legoPosebneKocke");
      const legoKocke = await collection.find({ cijena: { $gt: filterCijena } }).toArray();
        res.status(200).json(legoKocke);
    } catch (error) {
        
        res.status(400).send("Došlo je do greške");
      
    }
}

const legoPosebneLT = async (req, res, next) => {
    const filterCijena = parseFloat(req.params.cijena);
    try {
      const collection = global.db.collection("legoPosebneKocke");
      const legoPosebneKocke = await collection.find({ cijena: { $lt: filterCijena } }).toArray();
        res.status(200).json(legoPosebneKocke);
    } catch (error) {
        
        res.status(400).send("Došlo je do greške");
      
    }
}

const legoKockeNaziv = async (req, res, next) => {
    const filterNaziv = req.params.naziv;
    try {
      const collection = global.db.collection("kocke");
      const legoKocke = await collection.find({ naziv: filterNaziv }).toArray();
        res.status(200).json(legoKocke);
    } catch (error) {
        
        res.status(400).send("Došlo je do greške");
      
    }
}

const legoSetoviGET = async (req, res, next) => {
        const nazivSeta = req.body.naziv;

        if (!nazivSeta) {
            const collection = global.db.collection("legoSetovi");
            const legoSetovi = await collection.find().toArray();
        return res.status(200).json(legoSetovi);
        } else {
          const collection = db.collection("legoSetovi");
          const legoSetovi = await collection.find().toArray();
        const trazeniSet = legoSetovi.findIndex(
          (set) => set.naziv.toLowerCase() === nazivSeta.toLowerCase()
        );
        if (trazeniSet === -1) {
          return res.status(404).json({ error: "Set nije pronađen." });
        } else {
          return res.status(200).json(legoSetovi[trazeniSet]);
        }
      }
    }


export { trazenaFigurica, legoFiguriceGET, legoKockeGET, legoKockeIDPUT,postKocke, getLegoPosebne, legoPosebneGT, legoPosebneLT, legoKockeNaziv, legoSetoviGET  };




