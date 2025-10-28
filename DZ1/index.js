
const express = require("express");
const app = express();
const PORT = 3005;

app.listen(PORT, eror => {
    if (eror) {
        console.log('Server error: ', eror);
    }
    else {
        console.log(`Server is running on port ${PORT}`);
    }
})

let users = [{
    name: "John",
    age: 25
},
{
    name: "Jane",
    age: 30
},
{
    name: "Bob",
    age: 22
},
{
        name: "Bober",
        age: 67
}]

app.get('/', (req, res) => {
   
    res.sendFile( __dirname + '/Public/hello.html' );
    console.log("Pozvan hello.html!")
    
});

app.get('/about', (req, res) => {
    
    res.sendFile(__dirname + '/Public/about.html'); 
    console.log("Pozvan about.html!");

})

app.get('/users', (req, res) => {
    console.log("Pozvan /users!");
    res.json(users);
})
 
app.get('/users/:name', (req, res) => {
    let name = req.params.name;
    let trazeniUser = users.find(user=> user.name.toLowerCase() === name.toLowerCase());
    console.log("Pozvan /users!");
    if(!trazeniUser){
        return res.send('nema usera');
    }
    else {
        res.json(trazeniUser);
    }
    
 })
