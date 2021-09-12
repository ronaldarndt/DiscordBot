import { injectable } from 'tsyringe';
import { AsynCache } from '../modules/cache';
import { Redis } from '../modules/redis';

interface Server {
  id: string;
  prefix: string;
}

const fiveMin = 1000 * 60 * 5;

@injectable()
class ServersService {
  private static _cache: AsynCache<Server[]>;

  public get cache() {
    if (!ServersService._cache) {
      ServersService._cache = new AsynCache(fiveMin, this.getServersAsync);
    }

    return ServersService._cache;
  }

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

    ServersService._cache?.invalidate();
  };
}

export { Server, ServersService };
