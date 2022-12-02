import cachingService from "./cachingService";
import {createClient} from "celery-node";
import Task from "celery-node/dist/app/task";
import {Reference, StructuredReference} from "../models/reference"

const parsingService = {
    createParsing: (reference: Reference): string => {
        const celery_client = createClient(
            'redis://localhost:6379/1',
            'redis://localhost:6379/2'
        );
        const task: Task = celery_client.createTask("tasks.predict_fields");
        task.applyAsync([reference.fullText]).get().then((data: StructuredReference) => {
            reference.structured = data;
            cachingService.store(reference.id, JSON.stringify(reference));
        }).finally(() => celery_client.disconnect());
        return reference.id;
    },
    getParsing: async (id: string): Promise<Reference> => {
        const reference: Reference = await cachingService.get(id);
        return reference
    }
}

export default parsingService;