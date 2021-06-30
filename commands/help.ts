import { Message } from 'discord.js';
import { Command, helpList } from '.';
import { optional } from '../lib/commandDecorators';

export default class HelpCommand implements Command {
  async handler(message: Message, @optional command: string) {
    const list = command ? helpList.filter(([name]) => name === command) : helpList;

    const helpMessage = list.map(([name, message]) => `**${name}**:\n${message}`).join('\n');

    await message.channel.send(helpMessage);
  }

  help() {
    return '';
  }
}
