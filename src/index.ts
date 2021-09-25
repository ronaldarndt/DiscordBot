import { Client, Collection, Intents, Interaction, Message } from 'discord.js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { loadCommandsAsync, registerSlashCommandsAsync } from './lib/commands';
import { bandidoInterceptorAsync } from './middlewares/bandidoInterceptor';
import { botInterceptorAsync } from './middlewares/botInterceptor';
import { HandleInteraction } from './middlewares/handleInteraction';
import { env } from './modules/env';
import { MiddlewarePipeline } from './modules/middlewarePipeline';
import { configureRedisAsync, Redis } from './modules/redis';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

(async () => {
  const [commands, helps] = await loadCommandsAsync();
  const redis = await configureRedisAsync();

  await registerSlashCommandsAsync(commands, env.DISCORD_TOKEN);

  const messagePipeline = new MiddlewarePipeline<Message>()
    .use(botInterceptorAsync)
    .use(bandidoInterceptorAsync);

  const commandPipeline = new MiddlewarePipeline<Interaction>().use(
    HandleInteraction
  );

  container.register('help', { useValue: helps });
  container.register(Redis, { useValue: redis });
  container.register('commands', {
    useValue: new Collection(Object.entries(commands))
  });

  client
    .on('messageCreate', messagePipeline.execute)
    .on('interactionCreate', commandPipeline.execute)
    .once('ready', () => console.log('bot running'))
    .login(env.DISCORD_TOKEN);
})();
