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
import { configurePool, pool } from './modules/redis';

const client = new Discord.Client();

const pipeline = new MiddlewarePipeline<Message>()
  .use(botInterceptorAsync)
  .use(bandidoInterceptorAsync)
  .use(handleMessageAsync);

container.register('redis', {
  useFactory: () => new AsyncLazy(() => pool.getTedis()),
});

configurePool();

loadCommandsAsync().then(helps => {
  container.register('help', { useValue: helps });

  console.log('commands loaded');

  client.on('message', pipeline.execute);

  client.once('ready', () => console.log('bot running'));

  client.login(env.DISCORD_TOKEN);
});
