import { Collection, Interaction } from 'discord.js';
import { container, inject, injectable } from 'tsyringe';
import { getHandlerParameters } from '../lib/commandDecorators';
import { Command, CommandPrototype } from '../lib/commands';
import { ClassMiddleware } from '../modules/middlewarePipeline';

type Commands = Collection<string, CommandPrototype>;

@injectable()
class HandleInteraction extends ClassMiddleware<Interaction> {
  constructor(@inject('commands') private commands: Commands) {
    super();
  }

  executeAsync = async (
    interaction: Interaction,
    next: () => Promise<void>
  ) => {
    if (!interaction.isCommand()) {
      return next();
    }

    let command = this.commands.get(interaction.commandName);
    const subName = interaction.options.getSubcommand(false);

    if (subName) {
      command = command?.subCommands.get(subName);
    }

    if (!command || !command.hasHandler()) {
      return interaction.reply({
        content: 'Command not found. Type /help for more info',
        ephemeral: true
      });
    }

    const commandHandler = container.resolve<Command>(command);
    commandHandler.setInteraction(interaction);

    const parameters = getHandlerParameters(command).map(
      x => interaction.options.get(x.name)?.value
    );

    try {
      await commandHandler.handlerAsync!(...parameters);
    } catch (error) {
      interaction.reply('Error ' + error);
    }

    return next();
  };
}

export { HandleInteraction };
