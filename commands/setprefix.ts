import { Message } from 'discord.js';
import { Command } from '.';
import Servers from '../services/servers';

export default class PingCommand implements Command {
  async handler(message: Message, prefix: string) {
    const serversService = new Servers();

    const { id } = message.guild;

    await serversService.setPrefixAsync(id, prefix);

    await message.channel.send(
      `Command prefix for this server set as "${prefix}"`
    );
  }

  help() {
    return `Sets the prefix used for bot commands on the current server.
Example.: !setprefix @`;
  }
}
