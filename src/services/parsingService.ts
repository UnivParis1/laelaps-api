import cachingService from "./cachingService";

import uuid from "node-uuid";
import {createClient} from "celery-node";
import Task from "celery-node/dist/app/task";


const parsingService = {
    createParsing: (reference: string): string => {
        const id = uuid.v4();
        const celery_client = createClient(
            'redis://localhost:6379/1',
            'redis://localhost:6379/2'
        );
        const task: Task = celery_client.createTask("tasks.predict_fields");
        task.applyAsync([reference]).get().then((data: string) => {
            cachingService.store(id, data);
        }).finally(() => celery_client.disconnect());
        return id;
    }
}

export default parsingService;