import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';
import { ConversionsClass } from '../services/conversions';

@injectable()
class HexCommand extends Command {
  constructor(private conversions: ConversionsClass) {
    super();
  }

  async handlerAsync(hex: string) {
    const result = this.conversions.hexToDecimal(hex);

    await this.replyAsync(result);
  }

  static help() {
    return 'Converte um número hexadecimal em decimal';
  }
}

export default HexCommand;
