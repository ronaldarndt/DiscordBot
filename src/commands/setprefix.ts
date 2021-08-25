import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';
import { Redis } from '../modules/redis';
import { Servers } from '../services/servers';

@injectable()
export default class SetprefixCommand extends Command {
  static command = 'setprefix';

  constructor(private redis: Redis) {
    super();
  }

  async handlerAsync(prefix: string) {
    const serversService = new Servers(this.redis);

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

  static help() {
    return `Sets the prefix used for bot commands on the current server.
Example.: !setprefix @`;
  }
}
