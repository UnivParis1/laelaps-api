const parsingService = require("../services/parsingService");
const cachingService = require("../services/cachingService");


const parsingController = {
    createParsing: (req, res) => {
        res.send(parsingService.createParsing(req.body.reference));
    },
    getParsing: async (req, res) => {
        const parsing = await cachingService.get(req.params.id);
        res.send({success: true, parsing: parsing})
    }
}

module.exports = parsingController;