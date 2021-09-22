import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Collection, CommandInteraction } from 'discord.js';
import { promises } from 'fs';
import path from 'path';
import { env } from '../modules/env';
import { getHandlerParameters, Parameter } from './commandDecorators';

type CommandPrototype = typeof Command & (new () => Command);
type CommandList = Record<string, CommandPrototype>;
type Help = [command: string, text: string];

type GetParameterOptionBuilder = (
  builder: (builder: SlashCommandStringOption) => SlashCommandStringOption
) => SlashCommandBuilder;

type SlashBuilder =
  | SlashCommandBuilder
  | SlashCommandSubcommandBuilder
  | SlashCommandSubcommandsOnlyBuilder;

interface CommandContext {
  interaction: CommandInteraction;
}

abstract class Command {
  static command: string;
  static help: string;
  static subCommands = new Collection<string, CommandPrototype>();

  //@ts-ignore
  protected context: CommandContext;

  handlerAsync?(...args: unknown[]): Promise<void>;
  disposeAsync?(): Promise<void>;

  setContext(c: CommandContext) {
    this.context = c;
  }

  protected async replyAsync(message: string) {
    await this.context.interaction.reply(message);
  }

  static hasHandler<T extends Command>(this: new () => T) {
    return !!new this().handlerAsync;
  }
}

async function loadCommandsAsync() {
  const folderPath = path.resolve(__dirname, '..', 'commands');

  const files = await promises
    .readdir(folderPath)
    .then(files =>
      files
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
        .map(file => path.resolve(folderPath, file))
    );

  const helps: Array<Help> = [];
  const commands: CommandList = {};

  for (let file of files) {
    const commandClass = await import(path.resolve(folderPath, file)).then(
      x => x.default as CommandPrototype
    );

    const ext = path.extname(file);
    const filename = path.basename(file, ext);

    const name = commandClass.command || filename || commandClass.name;

    helps.push([name, commandClass.help]);
    commands[name] = commandClass;
  }

  return [commands, helps] as [CommandList, Array<Help>];
}

async function registerSlashCommandsAsync(
  commands: CommandList,
  token: string
) {
  const slashCommands = Object.entries(commands).map(([key, value]) => {
    let builder = buildCommand(key, value);

    if (builder instanceof SlashCommandBuilder) {
      for (const [subName, subCommand] of value.subCommands) {
        builder = builder.addSubcommand(
          sub => buildCommand(subName, subCommand, sub) as any
        );
      }
    }

    return builder.toJSON();
  });

  const rest = new REST({ version: '9' }).setToken(token);

  const route = env.DEV
    ? Routes.applicationGuildCommands(env.BOT_ID, env.GUILD_ID)
    : Routes.applicationCommands(env.BOT_ID);

  await rest.put(route, {
    body: slashCommands
  });
}

function buildCommand(
  key: string,
  command: CommandPrototype,
  baseBuilder:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder = new SlashCommandBuilder()
): SlashBuilder {
  let builder = baseBuilder.setName(key).setDescription(command.help);

  const isCommandBuilder =
    builder instanceof SlashCommandBuilder ||
    builder instanceof SlashCommandSubcommandBuilder;

  if (!isCommandBuilder) {
    return builder;
  }

  for (const param of getHandlerParameters(command)) {
    const optionBuilder = getParameterOptionBuilder(builder, param);

    builder = optionBuilder.call(builder, b =>
      b
        .setName(param.name)
        .setDescription(param.description)
        .setRequired(param.required)
    );
  }

  return builder;
}

function getParameterOptionBuilder(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  param: Parameter
): GetParameterOptionBuilder {
  if (param.type === 'Boolean') {
    return builder.addBooleanOption as any;
  } else if (param.type === 'Number') {
    return builder.addNumberOption as any;
  }

  return builder.addStringOption as any;
}

export {
  Command,
  CommandPrototype,
  loadCommandsAsync,
  registerSlashCommandsAsync,
  Help
};
