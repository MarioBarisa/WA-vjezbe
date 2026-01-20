import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

const users = [
  { id: 1, username: "johnDoe", password: "password" },
  { id: 2, username: "janeBB", password: "password123" },
  { id: 3, username: "admin", password: "super_secret_password" },
];

app.get("/", (req, res) => {
    res.send("Spremni za autentifikaciju!")
});

app.listen(PORT, () => {
  console.log(`Poslužitelj dela na portu ${PORT}`);
});

let plainPassword = "lozinka123";
let saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
    return;
  } else {
    console.log(`Hashirana lozinka: ${hash}`);
  }
});


async function checkPassword(plainPassword, hashedPassword) {
    try {
    let result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
    } catch (err) {
    console.error(`Došlo je do greške prilikom usporedbe _hash_ vrijednosti: ${err}`);
    return false;
    }
    }



app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    
    if (!user) {
        return res.status(404).send('Ne postoji korisnik!');
    }
    const lozinkaIspravna = await checkPassword(password, user.password);
    
    if (lozinkaIspravna) {
        return res.send('Uspješno ste autentificirani!');
    } else {
        return res.status(401).send('Neuspješna autentifikacija!'); // 401 - Unauthorized
    }
    });


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed_password = await bcrypt.hash(password, 10);
  if (!hashed_password) {
    // ako se iz nekog razloga dogodi greška prilikom hashiranja lozinke
    res.status(500).send("Došlo je do greške prilikom hashiranja lozinka!");
    return;
  }
  const novi_korisnik = {
    id: users.length + 1,
    username,
    password: hashed_password,
  };
  users.push(novi_korisnik);
  return res
    .status(201)
    .json({ message: "Korisnik uspješno registriran", user: novi_korisnik });
});