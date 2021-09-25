import { singleton } from 'tsyringe';
import { env } from '../modules/env';
import { fetchJsonAsync } from '../modules/requests';
import { BancoSecullum } from '../modules/types';

const headers = {
  'X-CodigoSecullumInterno': env.CODIGO_SECULLUM_INTERNO
};

@singleton()
class BancoService {
  async getAsync(id: string) {
    return fetchJsonAsync<BancoSecullum>(
      'https://autenticador.secullum.com.br/InformacoesBancos/PorBancoId/' + id,
      { headers }
    );
  }
}

export { BancoService };
