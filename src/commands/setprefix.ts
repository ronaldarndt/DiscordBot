import { Tedis } from 'tedis';
import { inject, injectable } from 'tsyringe';
import { Command } from '../lib/commands';
import { AsyncLazy } from '../modules/cache';
import { pool } from '../modules/redis';
import { Servers } from '../services/servers';

@injectable()
export default class SetprefixCommand extends Command {
  static command = 'setprefix';

  constructor(@inject('redis') private lazyRedis: AsyncLazy<Tedis>) {
    super();
  }

  async handlerAsync(prefix: string) {
    const serversService = new Servers(await this.lazyRedis.getAsync());

    const { guild } = this.context.message;

    if (!guild) {
      await this.replyAsync(
        'You can not use this command outside of a Discord server.'
      );

      return;
    }

    await serversService.setPrefixAsync(guild.id, prefix);

    await this.replyAsync(`Command prefix for this server set as "${prefix}"`);
  }

  async disposeAsync() {
    if (this.lazyRedis.loaded) {
      const tedis = await this.lazyRedis.getAsync();

      pool.putTedis(tedis);
    }
  }

  static help() {
    return `Sets the prefix used for bot commands on the current server.
Example.: !setprefix @`;
  }
}
