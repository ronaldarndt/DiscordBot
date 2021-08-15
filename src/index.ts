import Discord, { Message } from 'discord.js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { loadCommandsAsync } from './lib/commands';
import { bandidoInterceptorAsync } from './middlewares/bandidoInterceptor';
import { botInterceptorAsync } from './middlewares/botInterceptor';
import { handleMessageAsync } from './middlewares/handleMessage';
import './modules/array';
import { AsyncLazy } from './modules/cache';
import { env } from './modules/env';
import { MiddlewarePipeline } from './modules/middlewarePipeline';
import { configurePool, getPool } from './modules/redis';

const pipeline = new MiddlewarePipeline<Message>()
  .use(botInterceptorAsync)
  .use(bandidoInterceptorAsync)
  .use(handleMessageAsync);

const client = new Discord.Client();

configurePool();

container.register('redis', {
  useFactory: () => {
    const pool = getPool();
    return new AsyncLazy(() => pool.getTedis());
  },
});

loadCommandsAsync().then(helps => {
  container.register('help', { useValue: helps });

  client.on('message', pipeline.execute);

  console.log('commands loaded');
});

client.once('ready', () => console.log('bot running'));
client.login(env.DISCORD_TOKEN);
