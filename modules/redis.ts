import { TedisPool } from 'tedis';
import { env } from './env';

export let pool: TedisPool;

export const configurePool = () => {
  pool = new TedisPool({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PW,
  });
};

export const getRedisAsync = async () => pool.getTedis();
