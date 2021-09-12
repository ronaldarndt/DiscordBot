import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis';
import { env } from './env';

class Redis {
  constructor(public instance: WrappedNodeRedisClient) {}
}

function configureRedisAsync() {
  const redis = createNodeRedisClient({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PW
  });

  return new Promise<Redis>((res, rej) => {
    redis.nodeRedis.on('error', rej);
    redis.nodeRedis.on('ready', () => res(new Redis(redis)));
  });
}

export { configureRedisAsync, Redis };
