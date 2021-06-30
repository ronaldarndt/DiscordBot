import Discord from 'discord.js';
import { basename } from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';
import { tryParseCommand } from '../lib/utilts';
const readdirAsync = promisify(readdir);

type ClassMethods<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
};

abstract class CommandBase {
  abstract handler(message: Discord.Message, ...args: unknown[]): Promise<void>;
  abstract help(): string;

  protected getDecorator(key: symbol, from: keyof ClassMethods<this>) {}
}

class Teste extends CommandBase {
  xd: string;

  handler(message: Discord.Message, ...args: unknown[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  help() {
    this.getDecorator(Symbol(), 'handler');

    return '';
  }
}

new Teste().help();

const commands = new Map<string, Command>();

export const helpList: Array<[string, string]> = [];

export interface Command {
  handler: (message: Discord.Message, ...args: unknown[]) => Promise<void>;
  help: () => string;
}

export async function loadCommandsAsync() {
  const files = (await readdirAsync('./commands/')).filter(file => file.endsWith('.ts') && file != 'index.ts');

  for (let file of files) {
    const fileName = basename(file, '.ts');
    const commandClass: Command = new (await import('./' + fileName)).default();

    helpList.push([fileName, commandClass.help()]);
    commands.set(fileName, commandClass);
  }
}

export async function handleCommand(message: Discord.Message) {
  const text = message.content.substr(1).split(' ');
  const command = text[0];

  if (!commands.has(command)) {
    await message.channel.send('Command not found');

    return;
  }

  const handler = commands.get(command).handler;
  const [parseSuccess, args] = tryParseCommand(text, handler);

  if (!parseSuccess) {
    await message.channel.send(
      `Invalid parameters. Command ${command} expects ${handler.length - 1} parameters but received ${
        args.length
      }. Type !help ${command} for more info`
    );

    return;
  }

  await handler(message, ...args);
}
