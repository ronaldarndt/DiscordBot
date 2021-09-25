import { createAudioPlayer } from '@discordjs/voice';
import { Collection } from 'discord.js';
import { singleton } from 'tsyringe';
import ytsr, { Video } from 'ytsr';
import { GuildPlayer } from '../modules/types';

@singleton()
class SongQueueService {
  private guilds = new Collection<string, GuildPlayer>();

  create(guildId: string) {
    const player = createAudioPlayer();

    this.guilds.set(guildId, {
      player,
      queue: []
    });

    return player;
  }

  remove(guildId: string) {
    this.guilds.delete(guildId);
  }

  has(guildId: string) {
    return this.guilds.has(guildId);
  }

  skip(guildId: string) {
    const guild = this.get(guildId);

    guild.player.stop(true);
  }

  async searchAsync(songName: string) {
    const info = await ytsr(songName, { limit: 5, safeSearch: false });

    return info.items.find(x => x.type === 'video') as Video;
  }

  add(guildId: string, song: Video) {
    const guild = this.get(guildId);

    guild.queue.unshift(song);
  }

  pop(guildId: string) {
    const guild = this.get(guildId);

    return guild.queue.pop();
  }

  private get(guildId: string) {
    return this.guilds.get(guildId)!;
  }
}

export { SongQueueService };
