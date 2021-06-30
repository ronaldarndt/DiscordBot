import Discord from 'discord.js';
import dotenv from 'dotenv';
import { handleCommand, loadCommandsAsync } from './commands';

dotenv.config();

const client = new Discord.Client();

client.once('ready', async () => {
  await loadCommandsAsync();

  console.log('bot running');
});

client.on('message', async message => {
  if (message.content.startsWith('!')) {
    await handleCommand(message);
  }
});

client.login(process.env.TOKEN);
