import cachingService from "../services/cachingService";

import parsingService from "../services/parsingService";

import express from "express";

const parsingController = {
    createParsing: (req: express.Request, res: express.Response) => {
        res.send(parsingService.createParsing(req.body.reference));
    },
    getParsing: async (req: express.Request, res: express.Response) => {
        const parsing = await cachingService.get(req.params.id);
        res.send({success: true, parsing: parsing})
    }
}

export default parsingController;