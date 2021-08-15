import { Message } from 'discord.js';

async function bandidoInterceptorAsync(
  message: Message,
  next: () => Promise<void>
) {
  for (const ladrao of ['bandido', 'ladrão', 'ladrao', 'criminoso']) {
    if (message.content.toLowerCase().includes(ladrao)) {
      await message.reply(ladrao + '? Acho que você quis dizer Lincon.');

      break;
    }
  }

  await next();
}

export { bandidoInterceptorAsync };
