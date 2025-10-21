const express = require("express");
const app = express();
const PORT = 3005;

//predkoraci
//git clone repo
//cd u taj repo
//npm init -y
//nodemon index.js

//GIT

//git status
//git add .
//git commit - "poruka"
//git push


app.get("/", (req, res)  => {
    console.log("Pozvan je GET endpoint");
    res.send("Pozdrav iz expressa!");
});

app.listen(PORT, (error) => {
    if (error) {
        console.error("Error starting the server:", error);
    } else {
        console.log(`Server is running on ${PORT}`);
    }
 });

console.log(app);