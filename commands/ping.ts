import { Message } from 'discord.js';
import { Command } from '.';

export default class PingCommand implements Command {
  async handler(message: Message) {
    await message.channel.send(
      `pong! ${new Date().getTime() - message.createdTimestamp}ms`
    );
  }

  help() {
    return `Returns the amount of time it took for the server to receive your message.
Example.: !pong 300ms`;
  }
}
