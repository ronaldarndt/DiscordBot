import { Tedis } from 'tedis';
import { inject, injectable } from 'tsyringe';
import { Command } from '../lib/commands';
import { AsyncLazy } from '../modules/cache';
import { getPool } from '../modules/redis';
import { Servers } from '../services/servers';

@injectable()
export default class SetprefixCommand extends Command {
  static command = 'setprefix';

  constructor(@inject('redis') private lazyRedis: AsyncLazy<Tedis>) {
    super();
  }

  async handlerAsync(prefix: string) {
    const serversService = new Servers(await this.lazyRedis.getAsync());

    const { id } = this.context.message.guild;

    await serversService.setPrefixAsync(id, prefix);

    await this.replyAsync(`Command prefix for this server set as "${prefix}"`);
  }

  async disposeAsync() {
    if (this.lazyRedis.loaded) {
      const pool = getPool();
      const tedis = await this.lazyRedis.getAsync();

      pool.putTedis(tedis);
    }
  }

  static help() {
    return `Sets the prefix used for bot commands on the current server.
Example.: !setprefix @`;
  }
}
