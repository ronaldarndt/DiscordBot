import Discord from 'discord.js';
import { basename } from 'path';
import { promises } from 'fs';
import { tryParseCommand } from '../lib/utilts';
import { addHelp } from './help';

const commands = new Map<string, Command>();

export interface Command {
  handler: (message: Discord.Message, ...args: unknown[]) => Promise<void>;
  help: () => string;
}

export async function loadCommandsAsync() {
  const files = await promises
    .readdir('./commands/')
    .then(files =>
      files.filter(file => file.endsWith('.ts') && file != 'index.ts')
    );

  for (let file of files) {
    const fileName = basename(file, '.ts');
    const commandClass: Command = new (await import('./' + fileName)).default();

    addHelp([fileName, commandClass.help()]);

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
      `Invalid parameters. Command ${command} expects ${
        handler.length - 1
      } parameters but received ${
        args.length
      }. Type !help ${command} for more info`
    );

    return;
  }

  await handler(message, ...args);
}
