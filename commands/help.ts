import { Message } from 'discord.js';
import { Command } from '.';
import { optional } from '../lib/commandDecorators';

type Help = [string, string];

const helpList: Array<Help> = [];

export const addHelp = (help: Help) => {
  helpList.push(help);
};

export default class HelpCommand implements Command {
  async handler(message: Message, @optional command: string) {
    const list = command
      ? helpList.filter(([name]) => name === command)
      : helpList;

    const helpMessage = list
      .map(([name, message]) => `**${name}**:\n${message}`)
      .join('\n\n');

    await message.channel.send(helpMessage);
  }

  help() {
    return 'Returns this message.';
  }
}
