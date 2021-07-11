import Discord from 'discord.js';
import { env } from './modules/env';
import { handleCommand, loadCommandsAsync } from './commands';
import { configurePool } from './modules/redis';
import { getServersAsync } from './modules/cache';

const client = new Discord.Client();

configurePool();

client.once('ready', async () => {
  await loadCommandsAsync();

  console.log('bot running');
});

client.on('message', async message => {
  const {
    author: { id: userId },
    guild: { id: serverId },
  } = message;

  if (userId === client.user.id) {
    return;
  }

  const servers = await getServersAsync();

  const server = servers.find(x => x.id === serverId);

  const prefix = server?.prefix ?? '!';

  if (message.content.startsWith(prefix)) {
    await handleCommand(message);
  }
});

client.login(env.DISCORD_TOKEN);
