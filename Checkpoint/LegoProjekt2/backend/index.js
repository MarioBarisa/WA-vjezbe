import cors from 'cors';
import express from "express";
const app = express();
import { connectToDatabase } from './mongo.js';
import createLegoRoutes from "./routes/legoRoutes.js";

app.use(express.json());                           
app.use(express.urlencoded({ extended: true }));
app.use(cors());                               


/*let db = await connectToDatabase();

let lego_cursor = await db.collection('legocollection').find();
let lego = await lego_cursor.toArray(); */

const PORT = 3005;

async function setupRoutes() {
    let db = await connectToDatabase();
    app.use(createLegoRoutes(db));
}

app.listen(PORT, (error) => {
    setupRoutes();
    if (error) {
        console.error("Greška prilikom pokretanja servera:", error);
    }
    else {
        console.log("Server sluša na portu", PORT);
    }
})



