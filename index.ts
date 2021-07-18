import Discord from 'discord.js';
import { handleCommand, loadCommandsAsync } from './lib/commands';
import './modules/array';
import { env } from './modules/env';
import { configurePool } from './modules/redis';
import { cache } from './services/servers';

const client = new Discord.Client();

configurePool();

client.once('ready', async () => {
  await loadCommandsAsync();

  console.log('bot running');
});

client.on('message', async message => {
  const {
    author,
    guild: { id: guildId },
  } = message;

  if (author.bot) {
    return;
  }

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
});

client.login(env.DISCORD_TOKEN);
