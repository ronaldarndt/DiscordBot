import Discord, { Message } from 'discord.js';
import { promises } from 'fs';
import { basename } from 'path';
import { Tedis } from 'tedis';
import { tryParseCommand } from '../lib/utilts';
import { AsyncLazy } from '../modules/cache';
import { getRedisAsync, pool } from '../modules/redis';

type CustomCommand = typeof Command & (new () => Command);
type CommandList = { [name: string]: CustomCommand };
type Help = [command: string, text: string];

interface CommandContext {
  message: Message;
  redis: AsyncLazy<Tedis>;
}
const commands: CommandList = {};
const helps: Array<Help> = [];

abstract class Command {
  abstract name: string;
  static subCommands: CommandList = {};
  context: CommandContext;

  protected async replyAsync(message: string) {
    await this.context.message.channel.send(message);
  }

  static async initAsync<T extends Command>(
    this: new () => T,
    message: Message
  ) {
    const command = new this();

    command.context = {
      message,
      redis: new AsyncLazy(getRedisAsync),
    };

    return command;
  }

  static hasSub(this: CustomCommand, name: string) {
    return name in this.subCommands;
  }

  static hasHandler<T extends Command>(this: new () => T) {
    return !!new this().handler;
  }

  handler?(...args: unknown[]): Promise<void>;
  static help: () => string;
}

function getHelp() {
  return helps;
}

async function loadCommandsAsync() {
  const files = await promises
    .readdir('./commands/')
    .then(files =>
      files.filter(file => file.endsWith('.ts') && file != 'index.ts')
    );

  for (let file of files) {
    const filename = basename(file, '.ts');

    const commandClass = await import(`../commands/${filename}`).then(
      x => x.default as CustomCommand
    );

    //@ts-ignore
    const cmd: Command = new commandClass();

    helps.push([cmd.name, commandClass.help()]);
    commands[cmd.name] = commandClass;
  }
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

  const commandHandler = await command.initAsync(message);
  const { name, handler } = commandHandler;

  const [parseSuccess, args] = tryParseCommand(parts, handler);

  if (!parseSuccess) {
    await message.channel.send(
      'Invalid parameters.' +
        ` Command ${name} expects ${handler.length} parameters but received ${args.length}.` +
        ` Type !help ${name} for more info.`
    );

    return;
  }

  try {
    await commandHandler.handler(...args);
  } finally {
    const {
      context: { redis },
    } = commandHandler;

    if (redis.loaded) {
      pool.putTedis(await redis.getAsync());
    }
  }
}

export { Command, getHelp, loadCommandsAsync, handleCommand, commands };
