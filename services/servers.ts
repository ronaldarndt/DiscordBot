import { Tedis } from 'tedis';
import { container } from 'tsyringe';
import { AsynCache, AsyncLazy } from '../modules/cache';

interface Server {
  id: string;
  prefix: string;
}

const fiveMin = 1000 * 60 * 5;

class Servers {
  constructor(private redis: Tedis) {}

  getServersAsync = async () => {
    const keys = await this.redis.smembers('servers');

    const mapping = keys.map(
      async key => (await this.redis.hgetall(key)) as unknown
    );

    const servers = await Promise.all(mapping);

    return servers as Array<Server>;
  };

  setPrefixAsync = async (serverId: string, prefix: string) => {
    await this.redis.sadd('servers', serverId);

    await this.redis.hmset(serverId, {
      id: serverId,
      prefix,
    });

    Servers.cache.invalidate();
  };

  private static cache: AsynCache<Server[]>;

  static async getCacheAsync() {
    if (!this.cache) {
      const lazy = container.resolve<AsyncLazy<Tedis>>('redis');
      const instance = new Servers(await lazy.getAsync());

      this.cache = new AsynCache(fiveMin, instance.getServersAsync);
    }

    return this.cache;
  }
}

export { Server, Servers };
