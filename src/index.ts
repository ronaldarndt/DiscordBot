import Discord, { Message } from 'discord.js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { loadCommandsAsync } from './lib/commands';
import { bandidoInterceptorAsync } from './middlewares/bandidoInterceptor';
import { botInterceptorAsync } from './middlewares/botInterceptor';
import { handleMessageAsync } from './middlewares/handleMessage';
import './modules/array';
import { env } from './modules/env';
import { MiddlewarePipeline } from './modules/middlewarePipeline';
import { configureRedisAsync, Redis } from './modules/redis';

Promise.all([configureRedisAsync(), loadCommandsAsync()]).then(
  ([redis, helps]) => {
    console.log('commands loaded');

    const client = new Discord.Client();

    const pipeline = new MiddlewarePipeline<Message>()
      .use(botInterceptorAsync)
      .use(bandidoInterceptorAsync)
      .use(handleMessageAsync);

    container.register('help', { useValue: helps });
    container.register(Redis, { useValue: redis });

    client.on('message', pipeline.execute);

    client.once('ready', () => console.log('bot running'));

    client.login(env.DISCORD_TOKEN);
  }
);
