import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';

@injectable()
export default class PingCommand extends Command {
  static help =
    'Returns the amount of time it took for the server to receive your message.';

  async handlerAsync() {
    const sent = await this.interaction
      .reply({ content: 'Pinging...', fetchReply: true })
      .then(x => x as Message);

    const latency = sent.createdTimestamp - this.interaction.createdTimestamp;

    await this.interaction.editReply(`pong! ${latency}ms`);
  }
}
