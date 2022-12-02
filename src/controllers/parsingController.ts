import parsingService from "../services/parsingService";

import express from "express";
import {Reference} from "../models/reference";

const parsingController = {
    createParsing: (req: express.Request, res: express.Response) => {
        res.json(parsingService.createParsing(new Reference(req.body.reference)));
    },
    getParsing: async (req: express.Request, res: express.Response) => {
        const reference = await parsingService.getParsing(req.params.id);
        res.json({success: typeof (reference) == 'object' && Object.keys(reference).length > 1, parsing: reference.structured})
    }
}

export default parsingController;