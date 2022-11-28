const express = require('express');
const router = express.Router();

const parsing_controller = require("../controllers/parsingController");

router.post("/parsing", parsing_controller.createParsing);

router.get("/parsing/:id", parsing_controller.getParsing);

module.exports = router;
