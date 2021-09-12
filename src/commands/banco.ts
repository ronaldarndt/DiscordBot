import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { Command } from '../lib/commands';
import { env } from '../modules/env';

const headers = {
  'X-CodigoSecullumInterno': env.CODIGO_SECULLUM_INTERNO
};

@injectable()
export default class BancoCommand extends Command {
  async handlerAsync(bancoId: string) {
    const request = await fetch(
      'https://autenticador.secullum.com.br/InformacoesBancos/PorBancoId/' +
        bancoId,
      { headers }
    );

    const response = await request.json();

    const message = '```json\n' + JSON.stringify(response, null, 2) + '\n```';

    this.replyAsync(message);
  }

  static help() {
    return `Retorna informações sobre banco do conta secullum.
Exemplo: !banco 694
Retorno: {  "nome": "Teste Secullum", "identificador": "4113030e94fa4bddb554bf7d0698cad7"}`;
  }
}
