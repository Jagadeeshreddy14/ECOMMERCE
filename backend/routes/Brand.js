const express = require("express")
const brandController = require("../controllers/Brand")
const router = express.Router()

router
    .get("/", brandController.getAll)
    .post("/", brandController.create)  // Add this line

module.exports = router