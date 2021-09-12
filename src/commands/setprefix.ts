import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';
import { ServersService } from '../services/servers';

@injectable()
export default class SetprefixCommand extends Command {
  constructor(private servers: ServersService) {
    super();
  }

  async handlerAsync(prefix: string) {
    const { guild } = this.context.message;

    if (!guild) {
      await this.replyAsync(
        'You can not use this command outside of a Discord server.'
      );

      return;
    }

    await this.servers.setPrefixAsync(guild.id, prefix);

    await this.replyAsync(`Command prefix for this server set as "${prefix}"`);
  }

  static help() {
    return `Sets the prefix used for bot commands on the current server.
Example: !setprefix @`;
  }
}
