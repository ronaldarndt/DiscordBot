import { injectable } from 'tsyringe';
import { param } from '../lib/commandDecorators';
import { Command } from '../lib/commands';
import { WeatherService } from '../services/weather';

@injectable()
export default class TafrioCommand extends Command {
  static help = 'Responde se ta frio ou nao.';

  constructor(private weatherService: WeatherService) {
    super();
  }

  async handlerAsync(
    @param('cidade', 'Nome da cidade', false) cidade: string = 'porto alegre'
  ) {
    await this.interaction.deferReply();

    const dados = await this.weatherService.getAsync(cidade);

    if (!dados?.main) {
      return this.interaction.editReply('Local não encontrado.');
    }

    const { temp } = dados.main;
    const tempFormatada = temp.toString().replace('.', ',');

    const msg =
      temp < 16
        ? `ba cpx ta loco ${tempFormatada} grau`
        : `${tempFormatada} ta mec B)`;

    await this.interaction.editReply(msg);
  }
}
