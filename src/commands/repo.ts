import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';

@injectable()
class RepoCommand extends Command {
  static help = 'Retorna o link do repositório desse bot';

  async handlerAsync() {
    await this.replyAsync('https://github.com/ronaldarndt/DiscordBot');
  }
}

export default RepoCommand;
