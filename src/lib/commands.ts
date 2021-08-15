import Discord, { Message } from 'discord.js';
import { promises } from 'fs';
import path from 'path';
import { container } from 'tsyringe';
import { tryParseCommand } from './utilts';

type CustomCommand = typeof Command & (new () => Command);
type CommandList = { [name: string]: CustomCommand };
type Help = [command: string, text: string];

interface CommandContext {
  message: Message;
}

const commands: CommandList = {};

abstract class Command {
  static command: string;
  static subCommands: CommandList = {};

  //@ts-ignore
  protected context: CommandContext;

  handlerAsync?(...args: unknown[]): Promise<void>;
  disposeAsync?(): Promise<void>;

  setContext(c: CommandContext) {
    this.context = c;
  }

  protected async replyAsync(message: string) {
    await this.context.message.channel.send(message);
  }

  static hasSub(this: CustomCommand, name: string) {
    return name in this.subCommands;
  }

  static hasHandler<T extends Command>(this: new () => T) {
    return !!new this().handlerAsync;
  }

  static help: () => string;
}

async function loadCommandsAsync() {
  const folderPath = path.resolve(__dirname, '..', 'commands');

  const files = await promises
    .readdir(folderPath)
    .then(files =>
      files.filter(
        file =>
          (file.endsWith('.ts') || file.endsWith('.js')) &&
          !file.includes('index.')
      )
    );

  const helps: Array<Help> = [];

  for (let file of files) {
    const commandClass = await import(path.resolve(folderPath, file)).then(
      x => x.default as CustomCommand
    );

    const name = commandClass.command ?? commandClass.name;

    helps.push([name, commandClass.help()]);
    commands[name] = commandClass;
  }

  return helps;
}

async function handleCommand(
  message: Discord.Message,
  text: string,
  prefix: string,
  list?: CommandList
) {
  list ??= commands;

  const parts = text.split(/ +/);
  const userCommand = parts[0];

  const command = list[userCommand];
  const hasSub = command?.hasSub(parts[1]);

  if (!command || (!hasSub && !command.hasHandler())) {
    await message.channel.send(
      `Command not found. Type ${prefix}help for more info`
    );

    return;
  }

  if (hasSub) {
    await handleCommand(
      message,
      parts.skip(1).join(' '),
      prefix,
      command.subCommands
    );

    return;
  }

  const commandHandler = container.resolve(command);
  commandHandler.setContext({ message });

  const name = command.command ?? command.name;

  try {
    const { handlerAsync } = commandHandler;

    const [parseSuccess, args] = tryParseCommand(parts, handlerAsync!);

    if (!parseSuccess) {
      await message.channel.send(
        'Invalid parameters.' +
          ` Command ${name} expects ${
            handlerAsync!.length
          } parameters but received ${args.length}.` +
          ` Type !help ${name} for more info.`
      );

      return;
    }

    await commandHandler.handlerAsync!(...args);
  } finally {
    if (commandHandler.disposeAsync) {
      await commandHandler.disposeAsync();
    }
  }
}

export { Command, loadCommandsAsync, handleCommand, Help, commands };
