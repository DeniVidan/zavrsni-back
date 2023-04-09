const express = require('express');
const cors = require('cors');
const database = require("./services/database");

const route = require('./routes/route.js')

/* import dotenv from "dotenv"; */
/* console.log(database) */

/* dotenv.config() */
const app = express()
const port = 3000

app.use(cors())

app.use("/api", route)

app.listen(port, ()=>{console.log(`Server is running on port ${port}`)});

