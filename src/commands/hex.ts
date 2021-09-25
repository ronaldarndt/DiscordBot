import { injectable } from 'tsyringe';
import { param } from '../lib/commandDecorators';
import { Command } from '../lib/commands';
import { ConversionsService } from '../services/conversions';

@injectable()
class HexCommand extends Command {
  static help = 'Converte um número hexadecimal em decimal';

  constructor(private conversions: ConversionsService) {
    super();
  }

  async handlerAsync(@param('hex', 'Number in hexadecimal') hex: string) {
    const result = this.conversions.hexToDecimal(hex);

    await this.replyAsync(result);
  }
}

export default HexCommand;
