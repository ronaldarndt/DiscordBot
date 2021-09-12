import { Message } from 'discord.js';
import { container } from 'tsyringe';
import { handleCommand } from '../lib/commands';
import { ServersService } from '../services/servers';

async function handleMessageAsync(message: Message) {
  const { guild } = message;

  let prefix = '!';

  if (guild) {
    const service = container.resolve(ServersService);
    const servers = await service.cache.getAsync();

    const server = servers.find(x => x.id === guild.id);

    if (server?.prefix) {
      prefix = server.prefix;
    }
  }

  if (message.content.startsWith(prefix)) {
    await handleCommand(
      message,
      message.content.substr(prefix.length).trim(),
      prefix
    );
  }
}

export { handleMessageAsync };
