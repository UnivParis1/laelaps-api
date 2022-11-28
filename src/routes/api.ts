import parsing_controller from "../controllers/parsingController";

const express = require('express');
const router = express.Router();
router.post("/parsing", parsing_controller.createParsing);

router.get("/parsing/:id", parsing_controller.getParsing);

module.exports = router;
