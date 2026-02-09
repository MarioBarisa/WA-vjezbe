import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

import { body, query, param, check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../db.js";
let db = await connectToDatabase();

router.get("/usersTest", async (req, res) => {
  res.send("Korisnici rute rade");
});

router.get("/korisnici", async (req, res) => {
  let user_collection = db.collection("users");
  let users = await user_collection.find().toArray();
  return res.status(200).send(users);
});

async function hashPassword(plainPassword, saltRounds) {
  try {
    let hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (err) {
    console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
    return null;
  }
}

router.post(
  "/register",
  [
    body("email").exists().notEmpty().isEmail().exists(),
    body("username").notEmpty().isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("password").notEmpty().isAlphanumeric().isLength({ min: 8 }),
  ],
  async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashed_password = await hashPassword(password, 10);
    if (!hashed_password) {
      return res.status(500).send("Došlo je do greške prilikom hashiranja");
    } else {
      let users_collection = db.collection("users");
      let result = await users_collection.insertOne({
        username: username,
        email: email,
        password: hashed_password,
      });
      return res.status(200).send("Uspješno dodan korisnik.");
    }
  }
);

async function checkPassword(plainPassword, hashedPassword) {
  try {
    let result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
  } catch (err) {
    console.error(
      `Došlo je do greške prilikom usporedbe _hash_ vrijednosti: ${err}`
    );
    return false;
  }
}

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let user_collection = db.collection("users");
  let user = await user_collection.findOne({ username: username });

  if (!user) {
    return res.status(404).send("Korisnik ne postoji.");
  }
  try {
    const uspjeh = await checkPassword(password, user.password);

      if (uspjeh) {
          const token = jwt.sign(
              { username: user.username },
              process.env.JWT_SECRET,
              {expiresIn:'1h'}
          )
      return res.status(200).send(token);
    } else {
      return res.status(404).send("Kriva lozinka ili username.");
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
