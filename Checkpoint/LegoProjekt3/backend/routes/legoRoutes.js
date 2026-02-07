import express from "express";
import { body, param, validationResult } from 'express-validator'; 
const router = express.Router();


import { trazenaFigurica, legoFiguriceGET, legoKockeGET, legoKockeIDPUT, postKocke, getLegoPosebne, legoPosebneGT, legoPosebneLT, legoKockeNaziv, legoSetoviGET } from "../middleware/pretragaLego.js";

import { autorizacijaMiddleware ,adminMiddleware } from "../middleware/autorizacija.js";

export default function createLegoRoutes(db) {
  const router = express.Router();

  const legoFigurice = [
    { id: 1, naziv: "Pirate", cijena: 12.0 },
    { id: 2, naziv: "Astronaut", cijena: 15.5 },
    { id: 3, naziv: "Knight", cijena: 10.0 },
    { id: 4, naziv: "Ninja", cijena: 14.0 },
    { id: 5, naziv: "Robot", cijena: 20.0 },
    { id: 6, naziv: "Wizard", cijena: 18.0 },
    { id: 7, naziv: "Explorer", cijena: 16.0 },
    { id: 8, naziv: "Samurai", cijena: 14.5 },
    { id: 9, naziv: "Alien", cijena: 19.0 },
    { id: 10, naziv: "Cyborg", cijena: 22.0 },
  ];

  const legoKocke = [
    { id: 1, naziv: "Basic Brick", cijena: 0.1 },
    { id: 2, naziv: "Window", cijena: 0.5 },
    { id: 3, naziv: "Door", cijena: 0.75 },
    { id: 4, naziv: "Wheel", cijena: 1.0 },
    { id: 5, naziv: "Roof Tile", cijena: 0.3 },
    { id: 6, naziv: "Arch Brick", cijena: 0.4 },
    { id: 7, naziv: "Round Brick", cijena: 0.25 },
    { id: 8, naziv: "Slope Brick", cijena: 0.35 },
    { id: 9, naziv: "Plate", cijena: 0.15 },
    { id: 10, naziv: "Corner Brick", cijena: 0.2 },
  ];

  const legoPosebneKocke = [
    { id: 1, naziv: "Minifigure Head", cijena: 2.0 },
    { id: 2, naziv: "Printed Tile", cijena: 3.5 },
    { id: 3, naziv: "Technic Beam", cijena: 4.0 },
    { id: 4, naziv: "Hinge Brick", cijena: 2.5 },
    { id: 5, naziv: "Transparent Brick", cijena: 1.75 },
    { id: 6, naziv: "Glow-in-the-Dark Brick", cijena: 5.0 },
    { id: 7, naziv: "Flexible Tube", cijena: 3.0 },
    { id: 8, naziv: "Gear", cijena: 4.5 },
    { id: 9, naziv: "Ball Joint", cijena: 3.75 },
    { id: 10, naziv: "Decorative Element", cijena: 6.0 },
  ];

  const legoSetovi = [
    {
      id: 1,
      naziv: "Set 1",
      kocka: legoKocke[0],
      figurica: legoFigurice[1],
      posebnaKocka: legoPosebneKocke[2],
    },
    {
      id: 2,
      naziv: "Set 2",
      kocka: legoKocke[2],
      figurica: legoFigurice[3],
      posebnaKocka: legoPosebneKocke[10],
    },
    {
      id: 3,
      naziv: "Set 3",
      kocka: legoKocke[3],
      figurica: legoFigurice[4],
      posebnaKocka: legoPosebneKocke[8],
    },
    {
      id: 4,
      naziv: "Set 4",
      kocka: legoKocke[5],
      figurica: legoFigurice[8],
      posebnaKocka: legoPosebneKocke[3],
    },
    {
      id: 5,
      naziv: "Set 5",
      kocka: legoKocke[11],
      figurica: legoFigurice[9],
      posebnaKocka: legoPosebneKocke[5],
    },
  ];


  // RESET PODATAKA PRIJE SLANJA ILI BRISANJA BILO CEGA!!!!!
  router.post("/pocetnoFigurice", async (req, res) => {
    let lego_collection = db.collection("figurice");
    try {
      await lego_collection.deleteMany({});
      let reasult = await lego_collection.insertMany(legoFigurice);
      res.status(200).json({ insertedCount: reasult.insertedCount });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post("/pocetnoKocke", async (req, res) => {
    let lego_collection = db.collection("kocke");
    try {
      await lego_collection.deleteMany({});
      let reasult = await lego_collection.insertMany(legoKocke);
      res.status(200).json({ insertedCount: reasult.insertedCount });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post("/pocetnoLegoPosebneKocke", async (req, res) => {
    let lego_collection = db.collection("legoPosebneKocke");
    try {
      await lego_collection.deleteMany({});
      let reasult = await lego_collection.insertMany(legoPosebneKocke);
      res.status(200).json({ insertedCount: reasult.insertedCount });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post("/pocetnoLegoSetovi", async (req, res) => {
    let lego_collection = db.collection("legoSetovi");
    try {
      await lego_collection.deleteMany({});
      let reasult = await lego_collection.insertMany(legoSetovi);
      res.status(200).json({ insertedCount: reasult.insertedCount });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get("/", (req, res) => {
    console.log("Pozvan je GET ruta ");
    res.send("Pozdrav");
  });

  router.get("/figurice", [legoFiguriceGET] ,async (req, res) => {

  });

  router.get("/figurice/:naziv", [trazenaFigurica] ,async (req, res) => {

  });

  router.post("/figurice", [autorizacijaMiddleware, adminMiddleware,

    body('naziv').notEmpty().withMessage('Naziv je obavezan'),
    body('id').notEmpty().withMessage('id je obavezan'),
    body('cijena').notEmpty().withMessage('Cijena je obavezan')

   ] ,async (req, res) => {
    const { id, naziv, cijena } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

      const collection = db.collection("figurice");
      const result = await collection.insertOne({
      id: parseInt(id),
      naziv: naziv,
      cijena: parseFloat(cijena),
    });
    return res.status(201).send("Uspješno dodana nova figurica.");
  });

  router.delete("/figurice/:id",[autorizacijaMiddleware, adminMiddleware ],async (req, res) => {
      
      const figID = parseInt(req.params.id);
      const collection = db.collection("figurice");
      const result = await collection.deleteOne({ id: figID });

    if (result.deletedCount===0) {
      return res.status(400).send("Figurica ne postoji.");
    } else {
      return res.status(200).send("Figurica sa ID " + figID + " je obrisana.");
    }
  });

  // ------ KOCKE

  router.get("/legoKocke", [legoKockeGET], async (req, res) => {

  });

  router.put("/legoKocke/:id", [autorizacijaMiddleware, adminMiddleware,
    body('idKocke').notEmpty().withMessage('Id kocke je obavezan'),
    legoKockeIDPUT
  ], async (req, res) => {
  
  });

  router.patch("/legoKocke/promjenaEUR/:id", [autorizacijaMiddleware, adminMiddleware,
    body('cijenaEUR').isFloat({ min: 0 }).withMessage('Cijena mora biti pozitivan broj'),
    body('cijenaEUR').isFloat({ max: 100 }).withMessage('Cijena mora biti manja od 100')
   ],async (req, res) => {
        const idKocke = parseInt(req.params.id);
        const novaCijenaEUR = req.body.cijenaEUR;

        const collection = db.collection("kocke");
        const legoKocke = await collection.find().toArray();

        let index = -1;
    index = legoKocke.findIndex((kocka) => kocka.id === idKocke);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

        if (index === -1) {
            return res
                .status(404)
                .send("Kocka sa ID " + idKocke + " nije pronađena.");
        } else {
            const collection = db.collection("kocke");
        const result = await collection.updateOne(
            { id: idKocke },
            { $set: { cijena: novaCijenaEUR } }
        );
      return res
        .status(200)
        .send(
          "Uspješno ažurirana cijena kocke sa ID " +
            idKocke +
            " na " +
            novaCijenaEUR +
            " EUR."
        );
    }
  });

  router.patch("/legoKocke/promjenaNaziva/:id", [autorizacijaMiddleware, adminMiddleware,

    body('naziv').isAlphanumeric().withMessage("Naziv mora biti tekst"),
  ] ,async (req, res) => {
    let idKocke = -1;
    idKocke = parseInt(req.params.id);

    const noviNaziv = req.body.naziv;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (idKocke === -1) {
      return res
        .status(404)
        .send("Kocka sa ID " + idKocke + " nije pronađena.");
    } else {
        const collection = db.collection("kocke");
        await collection.updateOne(
            { id: idKocke },
            {
                $set: {
                naziv: noviNaziv
            }}
        );

      return res
        .status(200)
        .send(
          "Uspješno ažuriran naziv kocke sa ID " +
            idKocke +
            " na " +
            noviNaziv +
            "."
        );
    }
  });

    router.post("/legoKocke", [autorizacijaMiddleware, adminMiddleware ,postKocke] ,async (req, res) => {
      
  });

  // ------ POSEBNE KOCKE

  router.get("/legoPosebneKocke", [getLegoPosebne] ,async (req, res) => {

  });


  // QUERY PARAMETRI 

  //GT
  router.get("/legoPosebneKockeGT/:cijena", [legoPosebneGT] ,async (req, res) => {
  });
  
  //LT

  router.get("/legoPosebneKockeLT/:cijena", [legoPosebneLT] ,async (req, res) => {
  });

//NAZIV KOCKE
  router.get("/legoKockeNaziv/:naziv", [legoKockeNaziv] ,async (req, res) => {
  });


  //--------- Lego Setovi

  router.get("/legoSetovi", [legoSetoviGET] , async (req, res) => {
  });

  router.post("/legoSetovi", [autorizacijaMiddleware, adminMiddleware ],async (req, res) => {
    const noviSet = req.body;

    if (
      !noviSet.naziv ||
      !noviSet.kocka ||
      !noviSet.figurica ||
      !noviSet.posebnaKocka
    ) {
      return res.status(400).send("Nedostaju podaci za kreiranje seta.");
    } else {
        const collection = db.collection("legoSetovi");
        const legoSetovi = await collection.find().toArray();
      const index = legoSetovi.length;
      await collection.insertOne({
        id: index + 1,
        naziv: noviSet.naziv,
        kocka: legoKocke[noviSet.kocka - 1],
        figurica: legoFigurice[noviSet.figurica - 1],
        posebnaKocka: legoPosebneKocke[noviSet.posebnaKocka - 1],
        cijena: noviSet.cijena,
      });
      return res.status(200).send("Uspješno dodan novi set.");
    }
  });

  router.delete("/legoSetovi/:id", [autorizacijaMiddleware, adminMiddleware
   ],async (req, res) => {
    const id = parseInt(req.params.id);
    const collection = db.collection("legoSetovi");
    const legoSetovi = await collection.find().toArray();
    const index = legoSetovi.findIndex((set) => set.id === id);
    if (index === -1) {
      return res.status(404).send("Set nije pronađen.");
    } else {
      await collection.deleteOne({ id: id });
      return res.status(200).send(`Set sa ID ${id} je obrisan.`);
    }
  });

  return router;
}
