import { Command } from '../lib/commands';
import Servers from '../services/servers';

export default class SetprefixCommand extends Command {
  async handler(prefix: string) {
    const serversService = new Servers();

    const { id } = this.context.message.guild;

    await serversService.setPrefixAsync(id, prefix);

    await this.replyAsync(`Command prefix for this server set as "${prefix}"`);
  }

  static help() {
    return `Sets the prefix used for bot commands on the current server.
Example.: !setprefix @`;
  }
}
