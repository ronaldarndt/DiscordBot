import { codeBlock } from '@discordjs/builders';
import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { param } from '../lib/commandDecorators';
import { Command } from '../lib/commands';
import { env } from '../modules/env';

const headers = {
  'X-CodigoSecullumInterno': env.CODIGO_SECULLUM_INTERNO
};

@injectable()
export default class BancoCommand extends Command {
  static help = 'Retorna informações sobre um banco do conta secullum.';

  async handlerAsync(
    @param('banco_id', 'Id do banco à buscar') bancoId: string
  ) {
    await this.context.interaction.deferReply();

    const request = await fetch(
      'https://autenticador.secullum.com.br/InformacoesBancos/PorBancoId/' +
        bancoId,
      { headers }
    ).then(x => x.json());

    const response = codeBlock('json', JSON.stringify(request, null, 2));

    await this.context.interaction.editReply(response);
  }
}
