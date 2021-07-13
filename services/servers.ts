import { Tedis } from 'tedis';
import { AsynCache } from '../modules/cache';
import { getRedisAsync, pool } from '../modules/redis';

export interface Server {
  id: string;
  prefix: string;
}

export default class Servers {
  private _redis: Tedis;

  getServersAsync = async () => {
    await this.checkRedisAsync();

    const keys = await this._redis.smembers('servers');

    const mapping = keys.map(
      async (key) => (await this._redis.hgetall(key)) as unknown
    );

    const servers = await Promise.all(mapping);

    this.putRedis();

    return servers as Array<Server>;
  };

  setPrefixAsync = async (serverId: string, prefix: string) => {
    await this.checkRedisAsync();

    await this._redis.sadd('servers', serverId);

    await this._redis.hmset(serverId, {
      id: serverId,
      prefix,
    });

    cache.invalidate();

    this.putRedis();
  };

  private putRedis = () => {
    if (this._redis) {
      pool.putTedis(this._redis);

      this._redis = undefined;
    }
  };

  private checkRedisAsync = async () => {
    if (!this._redis) {
      this._redis = await getRedisAsync();
    }
  };
}

const fiveMin = 1000 * 60 * 5;

const cacheInstance = new Servers();

export const cache = new AsynCache(fiveMin, cacheInstance.getServersAsync);
