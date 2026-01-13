import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import fs from "fs";
const PORT = 3005;

const timer = (req, res, next) => {
    console.log(`Trenutno vrijeme: ${new Date().toLocaleString()}`);
    next();
};

app.use(timer);


const requestLogger = (req, res, next) => {
  const date = new Date().toLocaleString();
  const method = req.method; // HTTP metoda
  const url = req.originalUrl; // URL zahtjeva
  console.log(`[${date}] : ${method} ${url}`);
  next();
};
app.use(requestLogger);

app.listen(PORT, (error) => {
  if (error) {
    console.log("Greška prilikom pokretanja servera: ", error);
  } else {
    console.log(`Server je na portu ${PORT}`);
  }
});
/*
const middleware_fn = (req, res, next) => {
    console.log("Obrada mid_fn")
    next()
};

const middleware_fn2 = (req, res, next) => {
    console.log("Obrada mid_fn")
    next()
};

app.get('/', [middleware_fn,middleware_fn2], (req, res)=>{

});*/

const adminLogger = (req, res, next) => {

     console.log("Pristiga zahtjev na /admin.")
    return next();
}
app.get('/admin',[adminLogger], async (req, res) => {
    return res.status(200).message("uspjeh");
 })

let korisnici = [
  { id: 983498354, ime: "Ana", prezime: "Anić", email: "aanic@gmail.com" },
  { id: 983498355, ime: "Ivan", prezime: "Ivić", email: "iivic@gmail.com" },
  {
    id: 983498356,
    ime: "Sanja",
    prezime: "Sanjić",
    email: "ssanjic123@gmail.com",
  },
];

// dohvat svih korisnika
app.get("/korisnici", async (req, res) => {
  if (korisnici) {
    return res.status(200).json(korisnici);
  }
  return res.status(404).json({ message: "Nema korisnika" });
});

// dohvat pojedinog korisnika
app.get("/korisnici/:id", async (req, res) => {
  const id_route_param = parseInt(req.params.id);
  const korisnik = korisnici.find((korisnik) => korisnik.id === id_route_param);
  if (korisnik) {
    return res.status(200).json(korisnik);
  }
  return res.status(404).json({ message: "Korisnik nije pronađen" });
});


const validirajEmail = (req, res, next) => {
    if (req.body.email && typeof req.body.email === 'string') {
        
        return next()

    }
    else {
       return res.status(400).status("nesipravna struktura")
    }
}

const pronadiKorisnika = (req, res, next) => {

    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find((korisnik) => korisnik.id === id_route_param);
    
    if (korisnik) {
        
        req.pronadenKorisnika = korisnik;
        return next();
    }
    else {
        return res.status(404).json({ message: "Korisnik nije pronađen" });
    }
    
}


// ažuriranje email adrese pojedinog korisnika
app.patch("/korisnici/:id", [pronadiKorisnika,validirajEmail] ,async (req, res) => {
  //const id_route_param = parseInt(req.params.id);
  //const korisnik = korisnici.find((korisnik) => korisnik.id === id_route_param);
  //if (korisnik) {
    req.pronadenKorisnika.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(korisnik);
// }
});

