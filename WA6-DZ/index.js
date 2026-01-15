import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3005;
import router from "./routes/routes.js";
import { logger } from "./middleware/middleware.js";
app.use(logger)
app.use(router)

app.listen(PORT, (error) => {
    if(error) {
        console.log("Greška prilikom pokretanja servera: ", error);
    }
    else {
        console.log(`Server je na portu ${PORT}`);
    }
    
});


