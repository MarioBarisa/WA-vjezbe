const express = require("express");
const app = express();
const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.error("Error starting the server:", error);
    } else {
        console.log(`Server is running on ${PORT}`);
    }
 });

console.log(app);