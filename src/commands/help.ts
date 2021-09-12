import { inject, injectable } from 'tsyringe';
import { optional } from '../lib/commandDecorators';
import { Command, Help } from '../lib/commands';

@injectable()
class HelpCommand extends Command {
  constructor(@inject('help') private helpList: Help[]) {
    super();
  }

  async handlerAsync(@optional command: string = '') {
    const list = command
      ? this.helpList.filter(([name]) => name === command)
      : this.helpList;

    const helpMessage = list
      .map(([name, message]) => `<${name}>: ${message}`)
      .join('\n\n');

    await this.replyAsync('```md\n' + helpMessage + '\n```');
  }

  static help() {
    return 'Returns this message.';
  }
}

export default HelpCommand;
