const express = require('express');
const cors = require('cors');
const database = require("./services/database");
const route = require('./routes/route.js')
/* import dotenv from "dotenv"; */
/* console.log(database) */
/* dotenv.config() */

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*"
}));
app.use(express.json({ limit: "1mb" }));

/* app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

app.use("/api", route)

const port = 3030
app.listen(port, ()=>{console.log(`Server is running on port ${port}`)});