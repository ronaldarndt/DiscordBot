import { optional } from '../lib/commandDecorators';
import { Command, getHelp } from '../lib/commands';

class HelpCommand extends Command {
  name = 'help';

  async handler(@optional command: string = '') {
    const helpList = getHelp();

    const list = command
      ? helpList.filter(([name]) => name === command)
      : helpList;

    const helpMessage = list
      .map(([name, message]) => `**${name}**:\n${message}`)
      .join('\n\n');

    await this.replyAsync(helpMessage);
  }

  static help() {
    return 'Returns this message.';
  }
}

export default HelpCommand;
