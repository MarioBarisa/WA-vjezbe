import express from "express";

import { connectToDatabase } from "./db.js";

const app = express();

app.use(express.json());

const db = await connectToDatabase(); // primjer korištenja asinkrone funkcije za spajanje na bazu podataka

app.get("/", (req, res) => {
  res.send("wa-final backend radi!");
});

const PORT = 3000; // pripazite da je port slobodan, ako nije, promijenite ga

app.listen(PORT, (error) => {
  if (error) {
    console.log("Greška prilikom pokretanja poslužitelja", error);
  }
  console.log(`Poslužitelj sluša na http://localhost:${PORT}`);
});




