import { Collection } from 'discord.js';
import { injectable } from 'tsyringe';
import { Command, CommandPrototype } from '../lib/commands';

@injectable()
class AgendaAddCommand extends Command {
  static command = 'add';
  static help = 'WIP';

  async handlerAsync() {
    await this.replyAsync('taokay');
  }
}

@injectable()
class AgendaCommand extends Command {
  static help = 'WIP';
  static subCommands = new Collection<string, CommandPrototype>([
    ['add', AgendaAddCommand]
  ]);
}

export default AgendaCommand;
