import { codeBlock } from '@discordjs/builders';
import { injectable } from 'tsyringe';
import { param } from '../lib/commandDecorators';
import { Command } from '../lib/commands';
import { BancoService } from '../services/banco';

@injectable()
export default class BancoCommand extends Command {
  static help = 'Retorna informações sobre um banco do conta secullum.';

  constructor(private bancoService: BancoService) {
    super();
  }

  async handlerAsync(
    @param('banco_id', 'Id do banco à buscar') bancoId: string
  ) {
    await this.interaction.deferReply();

    const resposta = await this.bancoService.getAsync(bancoId);

    const response = codeBlock('json', JSON.stringify(resposta, null, 2));

    await this.interaction.editReply(response);
  }
}
