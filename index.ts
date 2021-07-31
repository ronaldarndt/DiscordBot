import Discord from 'discord.js';
import { loadCommandsAsync } from './lib/commands';
import { botInterceptorAsync } from './middlewares/botInterceptor';
import { handleMessageAsync } from './middlewares/handleMessage';
import { licoMiddleware } from './middlewares/lico';
import './modules/array';
import { env } from './modules/env';
import { MiddlewarePipeline } from './modules/middlewarePipeline';
import { configurePool } from './modules/redis';

const pipeline = new MiddlewarePipeline()
  .use(botInterceptorAsync)
  .use(licoMiddleware)
  .use(handleMessageAsync);

const client = new Discord.Client();

configurePool();

client.once('ready', async () => {
  await loadCommandsAsync();

  console.log('bot running');
});

client.on('message', pipeline.execute);

client.login(env.DISCORD_TOKEN);
