
import express from "express";
const app = express();
app.use(express.json());
import pizzaroutes from "./routes/pizze.js";
import narudzbeRouter from './routes/narudzbe.js';
app.use('/narudzbe', narudzbeRouter);
app.use("/pizze", pizzaroutes);

app.use(express.json());                           
app.use(express.urlencoded({ extended: true }));
app.use(pizzaroutes);                                   


app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
    });

const PORT = 3005;
   
app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
    });




