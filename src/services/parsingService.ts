import cachingService from "./cachingService";
import {createClient} from "celery-node";
import Task from "celery-node/dist/app/task";
import Client from "celery-node/dist/app/client";
import {Reference, StructuredReference} from "../models/reference";

const parsingService = {
    celery_client: () => createClient(
        process.env.CELERY_BROKER,
        process.env.CELERY_BACKEND,
    ),
    createParsing: (reference: Reference): string => {
        const celery_client = parsingService.celery_client();
        const task: Task = celery_client.createTask("tasks.predict_fields");
        task.applyAsync([reference.fullText]).get().then((data: StructuredReference) => {
            reference.structured = data;
            cachingService.store(reference.id, JSON.stringify(reference));
        }).finally(() => celery_client.disconnect());
        return reference.id;
    },
    getParsing: async (id: string): Promise<Reference> => {
        return await cachingService.get(id);
    }
}

export default parsingService;