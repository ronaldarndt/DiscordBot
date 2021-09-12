import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';

@injectable()
class RepoCommand extends Command {
  async handlerAsync() {
    await this.replyAsync('https://github.com/ronaldarndt/DiscordBot');
  }

  static help() {
    return 'Retorna o link do repositório desse bot';
  }
}

export default RepoCommand;
