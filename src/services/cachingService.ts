import {createClient} from "redis";

const cachingService = {
    redis: () => createClient(),
    store: (id, object) => {
        const redisClient = cachingService.redis();
        redisClient.connect().then(() => {
            redisClient.set(id, JSON.stringify(object)).catch((err1) => {
                console.log(err1);
            })
        });
    },
    get: async (id) => {
        const redisClient = await cachingService.redis();
        await redisClient.connect();
        const data = await redisClient.get(id);
        return JSON.parse(data);
    }
}

export default cachingService;
