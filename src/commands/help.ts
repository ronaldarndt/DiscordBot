import { codeBlock } from '@discordjs/builders';
import { inject, injectable } from 'tsyringe';
import { param } from '../lib/commandDecorators';
import { Command, Help } from '../lib/commands';

@injectable()
class HelpCommand extends Command {
  static help = 'Returns commands information.';

  constructor(@inject('help') private helpList: Help[]) {
    super();
  }

  async handlerAsync(
    @param('command', 'which command to search', false) command?: string
  ) {
    const list = command
      ? this.helpList.filter(([name]) => name === command)
      : this.helpList;

    const helpMessage = list
      .map(([name, message]) => `<${name}>: ${message}`)
      .join('\n\n');

    const response = codeBlock('md', helpMessage);

    await this.replyAsync(response);
  }
}

export default HelpCommand;
