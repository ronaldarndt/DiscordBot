import { TedisPool } from 'tedis';
import { env } from './env';

let pool: TedisPool;

const configurePool = () => {
  pool = new TedisPool({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PW,
  });
};

export { configurePool, pool };
