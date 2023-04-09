const express = require("express")
const router = express.Router()

router.get("/", (req, res) => res.send("cao iz routera"))

router.get("/a", (req, res) => res.send("cao na drugoj ruti"))

module.exports = router