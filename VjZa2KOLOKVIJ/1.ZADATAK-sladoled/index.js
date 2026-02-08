import express from "express";

import { connectToDatabase } from "./db.js";
import router from "./routes/drinks.js";
import usersRoutes from "./routes/users.js";

const app = express();
const logger = (req, res, next) => {
  const timeStamp = new Date().toISOString();
  console.log("Vrijeme: ", timeStamp);
  console.log("Ruta", req.originalUrl);
  console.log(req.method);
  console.log(req.headers);
  console.log(req.body);
  next();
};

app.use(logger);
app.use(express.json());
app.use(router);
app.use(usersRoutes)

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
