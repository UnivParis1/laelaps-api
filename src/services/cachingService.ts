import {createClient} from "redis";
import {Reference} from "../models/reference";

const cachingService = {
    redis: () => createClient({
        url: process.env.REDIS_URL,
        database: parseInt(process.env.REDIS_DATABASE)
    }),
    store: (id: string, object: string) => {
        const redisClient = cachingService.redis();
        redisClient.connect().then(() => {
            redisClient.set(id, object).catch((err1) => {
                console.log(err1);
            })
        });
    },
    get: async (id: string): Promise<Reference> => {
        const redisClient = await cachingService.redis();
        await redisClient.connect();
        const data: string = await redisClient.get(id);
        return Object.assign(new Reference(""), JSON.parse(data));
    }
}

export default cachingService;
