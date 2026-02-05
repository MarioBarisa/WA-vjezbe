import { config } from "dotenv";

config();

const url = process.env.URL;

import { MongoClient } from "mongodb";

async function connectToDatabase() {

    try {

        const client = new MongoClient(url)
        await client.connect();
        global.db = client.db("legoprojekt");
        console.log("Uspjeh. SPOJEN NA DB.");
        let db = client.db("legoprojekt")
        return db;
        
    } catch (error) {
        console.error("Došlo je do greške u spajanju.", error)
    }
    
}

export { connectToDatabase };

