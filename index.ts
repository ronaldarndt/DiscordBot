import Discord from 'discord.js';
import { handleCommand, loadCommandsAsync } from './lib/commands';
import { env } from './modules/env';
import { configurePool } from './modules/redis';
import { cache } from './services/servers';

const client = new Discord.Client();

configurePool();

client.once('ready', async () => {
  await loadCommandsAsync();

  console.log('bot running');
});

client.on('message', async (message) => {
  const {
    author: { id: userId },
    guild: { id: serverId },
  } = message;

  if (userId === client.user.id) {
    return;
  }

  const servers = await cache.getAsync();

  const server = servers.find((x) => x.id === serverId);

  const prefix = server?.prefix ?? '!';

  if (message.content.startsWith(prefix)) {
    await handleCommand(message);
  }
});

client.login(env.DISCORD_TOKEN);
