import parsing_controller from "../controllers/parsingController";

import express from "express";

const router = express.Router();

router.post("/parsing", parsing_controller.createParsing);

router.get("/parsing/:id", parsing_controller.getParsing);

module.exports = router;
