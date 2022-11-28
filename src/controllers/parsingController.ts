import cachingService from "../services/cachingService";

import parsingService from "../services/parsingService";

const parsingController = {
    createParsing: (req, res) => {
        res.send(parsingService.createParsing(req.body.reference));
    },
    getParsing: async (req, res) => {
        const parsing = await cachingService.get(req.params.id);
        res.send({success: true, parsing: parsing})
    }
}

export default parsingController;