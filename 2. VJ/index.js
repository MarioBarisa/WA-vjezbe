import express from "express";

let app = express();

//TREBA DODAT!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3005, (error) => {
    
    if (error) {
        console.error("Greska prilikom pokretanja servera:", error);
        return;
    }
    console.log("Server je pokrenut na portu 3005");

});


app.get("/", (req, res) => {
    console.log("Pozvan je GET ruta ");
    res.send("Pozdrav");
});

// primjer posluzitelja za narucivanje pizze

let pizze = [
    {
        id: 1, naziv: "Margherita", cijena: 5.00,
    },
    {
        id: 2, naziv: "Pepperoni", cijena: 6.50,
    },
    {
        id: 3, naziv: "Hawaiian", cijena: 7.00,
    },
    {
        id: 4, naziv: "Veggie", cijena: 6.00,
    },
    {
        id: 5, naziv: "BBQ Chicken", cijena: 8.00,
    }
];

app.get("/pizze", (req, res) => { 
    res.json(pizze);
});

app.get("/pizze/:naziv", (req, res) => {
    let nazivP = req.params.naziv;
    console.log("Trazi se pizza sa nazivom:", nazivP);
    let trazena_pizza = pizze.find(pizza => pizza.naziv.toLowerCase() === nazivP.toLowerCase());
    res.json(trazena_pizza);
});

// find - nadi jednog u plju
//findIndex - nadi index jednog u plju
// map - napravi novu plju na osnovu postojece
// filter - napravi novu plju sa elementima koji zadovoljavaju uvjet
// splice - brise element iz plju na osnovu indexa
// map - izmjeni element u plju na osnovu indexa
 
app.post("/pizze", express.json(), (req, res) => {
    let nova_pizza = req.body;
    pizze.push(nova_pizza);
    res.send("Stigla je nova pizza: ", nova_pizza );
 });