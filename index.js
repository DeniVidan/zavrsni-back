const express = require('express');
const cors = require('cors');
const database = require("./services/database");
const route = require('./routes/route.js')
/* import dotenv from "dotenv"; */
/* console.log(database) */
/* dotenv.config() */

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/api", route)

const port = 3030
app.listen(port, ()=>{console.log(`Server is running on port ${port}`)});