const dotenv = require("dotenv")
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')

dotenv.config({path: './config.env'});
require("./db/conn")
app.use(cookieParser())
app.use(express.json());
app.use(require("./router/auth"));


const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log(`running on port ${PORT}`)
});