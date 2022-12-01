import {createClient} from "redis";

const cachingService = {
    redis: () => createClient(),
    store: (id: string, object: Object) => {
        const redisClient = cachingService.redis();
        redisClient.connect().then(() => {
            redisClient.set(id, JSON.stringify(object)).catch((err1) => {
                console.log(err1);
            })
        });
    },
    get: async (id: string): Promise<Object> => {
        const redisClient = await cachingService.redis();
        await redisClient.connect();
        const data: string = await redisClient.get(id);
        return JSON.parse(data);
    }
}

export default cachingService;
