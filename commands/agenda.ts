import { Command } from '../lib/commands';

class AgendaAddCommand extends Command {
  name: 'add';

  async handler() {
    await this.replyAsync('taokay');
  }

  static help() {
    return 'WIP';
  }
}

export default class AgendaCommand extends Command {
  name = 'agenda';
  static subCommands = {
    add: AgendaAddCommand,
  };

  static help() {
    return `WIP`;
  }
}
