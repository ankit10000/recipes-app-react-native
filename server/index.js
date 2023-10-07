const express = require('express');
const app = express();

PORT = 3001;

app.get('/',(req, res)=>{
    res.send("hello  ")
})

app.listen(PORT, ()=>{
    console.log(`hello server at ${PORT}`)
})