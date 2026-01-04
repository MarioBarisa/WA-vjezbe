
import express from "express";
const app = express();
import legoRoutes from "./routes/legoRoutes.js";

app.use(express.json());                           
app.use(express.urlencoded({ extended: true }));
app.use(legoRoutes);                                   


const legoFigurice = [
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

const legoKocke = [
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

const legoPosebneKocke = [
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


const legoSetovi = [
    { id: 1, naziv: "Set 1", kocka: legoKocke[0], figurica: legoFigurice[1], posebnaKocka: legoPosebneKocke[2]  },
    { id: 2, naziv: "Set 2", kocka: legoKocke[2], figurica: legoFigurice[3], posebnaKocka: legoPosebneKocke[10] },
    { id: 3, naziv: "Set 3", kocka: legoKocke[3], figurica: legoFigurice[4], posebnaKocka: legoPosebneKocke[8]  },
    { id: 4, naziv: "Set 4", kocka: legoKocke[5], figurica: legoFigurice[8], posebnaKocka: legoPosebneKocke[3]  },
    { id: 5, naziv: "Set 5", kocka: legoKocke[11], figurica: legoFigurice[9], posebnaKocka: legoPosebneKocke[5] },
]



import { connectToDatabase } from './mongo.js';
let db = await connectToDatabase();

let lego_cursor = await db.collection('legocollection').find();
let lego = await lego_cursor.toArray();

const PORT = 3005;

app.listen(PORT, (error) => {
    if (error) {
        console.error("Greška prilikom pokretanja servera:", error);
    }
    else {
        console.log("Server sluša na portu", PORT);
    }
})



app.post('/pocetnoFigurice', async (req, res) => {
        let lego_collection = db.collection('figurice');
        try {
            await lego_collection.deleteMany({});
            let reasult = await lego_collection.insertMany(legoFigurice);
            res.status(200).json({ insertedCount: reasult.insertedCount });
        } catch (error) {
            res.status(400).send(error)
        }
}) 

app.post('/pocetnoKocke', async (req, res) => {
    let lego_collection = db.collection('kocke');
    try {
        await lego_collection.deleteMany({});
        let reasult = await lego_collection.insertMany(legoKocke);
        res.status(200).json({ insertedCount: reasult.insertedCount });
    } catch (error) {
        res.status(400).send(error)
    }
}) 

app.post('/pocetnoLegoPosebneKocke', async (req, res) => {
        let lego_collection = db.collection('legoPosebneKocke');
        try {
            await lego_collection.deleteMany({});
            let reasult = await lego_collection.insertMany(legoPosebneKocke);
            res.status(200).json({ insertedCount: reasult.insertedCount });
        } catch (error) {
            res.status(400).send(error)
        }
})

app.post('/pocetnoLegoSetovi', async (req, res) => {
        let lego_collection = db.collection('legoSetovi');
        try {
            await lego_collection.deleteMany({});
            let reasult = await lego_collection.insertMany(legoSetovi);
            res.status(200).json({ insertedCount: reasult.insertedCount });
        } catch (error) {
            res.status(400).send(error)
        }
})

//app.use("/api", legoRoutes);
