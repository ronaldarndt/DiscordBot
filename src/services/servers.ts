import { container } from 'tsyringe';
import { AsynCache } from '../modules/cache';
import { Redis } from '../modules/redis';

interface Server {
  id: string;
  prefix: string;
}

const fiveMin = 1000 * 60 * 5;

class Servers {
  constructor(private redis: Redis) {}

  getServersAsync = async () => {
    const keys = await this.redis.instance.smembers('servers');

    const mapping = keys.map(
      async key => (await this.redis.instance.hgetall(key)) as unknown
    );

    const servers = await Promise.all(mapping);

    return servers as Array<Server>;
  };

  setPrefixAsync = async (serverId: string, prefix: string) => {
    await this.redis.instance.sadd('servers', serverId);

    await this.redis.instance.hmset(
      serverId,
      ['id', serverId],
      ['prefix', prefix]
    );

    Servers.cache.invalidate();
  };

  private static cache: AsynCache<Server[]>;

  static async getCacheAsync() {
    if (!this.cache) {
      const redis = container.resolve(Redis);

      const instance = new Servers(redis);

      this.cache = new AsynCache(fiveMin, instance.getServersAsync);
    }

    return this.cache;
  }
}

export { Server, Servers };
