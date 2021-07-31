import { Message } from 'discord.js';

async function botInterceptorAsync(
  message: Message,
  next: () => Promise<void>
) {
  const { author } = message;

  if (author.bot) {
    return;
  }

  await next();
}

export { botInterceptorAsync };
