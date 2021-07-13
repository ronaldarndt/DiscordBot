import Discord, { Message } from 'discord.js';
import { promises } from 'fs';
import { basename } from 'path';
import { Tedis } from 'tedis';
import { tryParseCommand } from '../lib/utilts';
import { AsyncLazy } from '../modules/cache';
import { getRedisAsync, pool } from '../modules/redis';

type CustomCommand = typeof Command & (new () => Command);
type Help = [command: string, text: string];

interface CommandContext {
  message: Message;
  redis: AsyncLazy<Tedis>;
}
const commands = new Map<string, CustomCommand>();
const helps: Array<Help> = [];

abstract class Command {
  context: CommandContext;

  protected async replyAsync(message: string) {
    await this.context.message.channel.send(message);
  }

  public static async initAsync<T extends Command>(
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

  abstract handler(...args: unknown[]): Promise<void>;
  static help: () => string;
}

function getHelp() {
  return helps;
}

async function loadCommandsAsync() {
  const files = await promises
    .readdir('./commands/')
    .then((files) =>
      files.filter((file) => file.endsWith('.ts') && file != 'index.ts')
    );

  for (let file of files) {
    const filename = basename(file, '.ts');

    const commandClass: CustomCommand = (
      await import('../commands/' + filename)
    ).default;

    helps.push([filename, commandClass.help()]);
    commands.set(filename, commandClass);
  }
}

async function handleCommand(message: Discord.Message) {
  const text = message.content.substr(1).split(' ');
  const command = text[0];

  if (!commands.has(command)) {
    await message.channel.send('Command not found');

    return;
  }

  const commandHandler = await commands.get(command).initAsync(message);

  const {
    context: { redis },
  } = commandHandler;

  const [parseSuccess, args] = tryParseCommand(text, commandHandler.handler);

  if (!parseSuccess) {
    await message.channel.send(
      'Invalid parameters.' +
        `Command ${command} expects ${commandHandler.handler.length} parameters but received ${args.length}.` +
        `Type !help ${command} for more info`
    );

    return;
  }

  await commandHandler.handler(...args);

  if (redis.loaded) {
    pool.putTedis(await redis.getAsync());
  }
}

export { Command, getHelp, loadCommandsAsync, handleCommand, commands };
