const celery = require('celery-node');

const uuid = require('node-uuid');

const cachingService = require("./cachingService")

const parsingService = {
    createParsing: (reference) => {
        const id = uuid.v4();
        const celery_client = celery.createClient(
            'redis://localhost:6379/1',
            'redis://localhost:6379/2'
        );
        const task = celery_client.createTask("tasks.predict_fields");
        task.applyAsync([reference]).get().then(data => {
            cachingService.store(id, data);
        }).finally(() => celery_client.disconnect());
        return id;
    }
}

module.exports = parsingService;