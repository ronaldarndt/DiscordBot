import { getVoiceConnection } from '@discordjs/voice';
import { injectable } from 'tsyringe';
import { SongQueueService } from '../services/songQueue';
import { SongCommandBase } from './play';

@injectable()
class SkipCommand extends SongCommandBase {
  static help = 'Skips the current song.';

  constructor(private songQueue: SongQueueService) {
    super();
  }

  async handlerAsync() {
    const channel = this.getVoiceChannel(this.interaction.member);

    if (!channel) {
      return;
    }

    const { guildId } = channel;

    const botChannel = getVoiceConnection(guildId);

    if (channel.id !== botChannel?.joinConfig.channelId) {
      return this.replyAsync(
        'Você deve estar no mesmo canal de voz que o bot.',
        { ephemeral: true }
      );
    }

    if (!this.songQueue.has(guildId)) {
      return this.replyAsync('Nada para pular.', { ephemeral: true });
    }

    this.replyAsync('Pulando...');

    this.songQueue.skip(guildId);
  }
}

export default SkipCommand;
