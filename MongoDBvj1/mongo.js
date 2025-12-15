
/*const { MongoClient, ServerApiVersion } = require('mongodb');"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/

import { config } from "dotenv";

config();

const url = process.env.URL;

import { MongoClient } from "mongodb";

async function connectTodatabase() {

    try {

        const client = new MongoClient(url)
        await client.connect();
        console.log("Uspjeh. SPOJEN NA DB.");
        let db = client.db("wa-test")
        return db;
        
    } catch (error) {
        console.error("Došlo je do greške u spajanju.", error)
    }
    
}

export default connectTodatabase;