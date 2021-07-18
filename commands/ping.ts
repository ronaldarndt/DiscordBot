import { Command } from '../lib/commands';

export default class PingCommand extends Command {
  name = 'ping';

  async handler() {
    const delay = new Date().getTime() - this.context.message.createdTimestamp;

    await this.replyAsync(`pong! ${delay}ms`);
  }

  static help() {
    return `Returns the amount of time it took for the server to receive your message.
Example.: !pong 300ms`;
  }
}
