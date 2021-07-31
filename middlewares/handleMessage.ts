import { Message } from 'discord.js';
import { handleCommand } from '../lib/commands';
import { cache } from '../services/servers';

async function handleMessageAsync(message: Message) {
  const {
    guild: { id: guildId },
  } = message;

  const servers = await cache.getAsync();

  const server = servers.find(x => x.id === guildId);

  const prefix = server?.prefix ?? '!';

  if (message.content.startsWith(prefix)) {
    await handleCommand(
      message,
      message.content.substr(prefix.length).trim(),
      prefix
    );
  }
}

export { handleMessageAsync };
