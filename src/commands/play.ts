import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus
} from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import { APIInteractionGuildMember } from 'discord.js/node_modules/discord-api-types/payloads/v9/_interactions/base';
import { injectable } from 'tsyringe';
import downloadAudioAsync from 'ytdl-core-discord';
import { Video } from 'ytsr';
import { param } from '../lib/commandDecorators';
import { Command } from '../lib/commands';
import { SongQueueService } from '../services/songQueue';

type Member = GuildMember | APIInteractionGuildMember | null;

class SongCommandBase extends Command {
  protected getVoiceChannel(member: Member) {
    const isInVoiceChannel =
      !!member && 'voice' in member && !!member.voice.channel;

    if (!isInVoiceChannel) {
      this.replyAsync('Você deve estar em um canal de voz.', {
        ephemeral: true
      });
    }

    return isInVoiceChannel ? member.voice.channel : undefined;
  }
}

@injectable()
class PlayCommand extends SongCommandBase {
  static help = 'Plays a song.';

  constructor(private songQueue: SongQueueService) {
    super();
  }

  async handlerAsync(@param('name', 'song name', true) name: string) {
    const channel = this.getVoiceChannel(this.interaction.member);

    if (!channel) {
      return;
    }

    const { guildId } = channel;

    await this.interaction.deferReply();

    const song = await this.songQueue.searchAsync(name);

    if (this.songQueue.has(guildId)) {
      this.songQueue.add(guildId, song);

      return this.interaction.editReply(
        'Adicionado na fila "' + song.title + '"'
      );
    }

    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: guildId
    });

    const player = this.songQueue.create(guildId);

    connection.subscribe(player);

    this.configureHandlers(connection, player, guildId);

    this.playAsync(player, song);
  }

  private async playAsync(player: AudioPlayer, song: Video) {
    this.sendOrEditReplyAsync('Tocando "' + song.title + '"');

    const readable = await downloadAudioAsync(song.url, {
      highWaterMark: 1 << 25,
      quality: 'lowestaudio'
    });
    const resource = createAudioResource(readable);

    player.play(resource);
  }

  private stop(
    connection: VoiceConnection,
    player: AudioPlayer,
    guildId: string
  ) {
    connection.destroy();
    player.stop();
    this.songQueue.remove(guildId);
  }

  private configureHandlers(
    connection: VoiceConnection,
    player: AudioPlayer,
    guildId: string
  ) {
    player.on(AudioPlayerStatus.Idle, async () => {
      const song = this.songQueue.pop(guildId);

      if (!song) {
        this.stop(connection, player, guildId);
        return;
      }

      this.playAsync(player, song);
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000)
        ]);
      } catch {
        this.stop(connection, player, guildId);
      }
    });
  }

  private sendOrEditReplyAsync(message: string) {
    if (this.interaction.replied) {
      return this.interaction.channel?.send(message);
    }

    return this.interaction.editReply(message);
  }
}

export { SongCommandBase };
export default PlayCommand;
