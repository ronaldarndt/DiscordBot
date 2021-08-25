import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';

@injectable()
class AgendaAddCommand extends Command {
  static command = 'add';

  async handlerAsync() {
    await this.replyAsync('taokay');
  }

  static help() {
    return 'WIP';
  }
}

@injectable()
export default class AgendaCommand extends Command {
  static command = 'agenda';
  static subCommands = {
    add: AgendaAddCommand
  };

  static help() {
    return `WIP`;
  }
}
