import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { param } from '../lib/commandDecorators';
import { Command } from '../lib/commands';
import { OpenWeatherMapQueryResult } from '../modules/types';

const key = process.env.OPENWEATHERMAP_KEY;

@injectable()
export default class TafrioCommand extends Command {
  static help = 'Responde se ta frio ou nao.';

  async handlerAsync(
    @param('cidade', 'Nome da cidade', false) cidade: string = 'porto alegre'
  ) {
    await this.context.interaction.deferReply();

    const dados = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${key}`
    ).then(
      async x => (await x.json()) as OpenWeatherMapQueryResult | undefined
    );

    if (!dados?.main) {
      return this.replyAsync('Location not found.');
    }

    const { temp } = dados.main;
    const tempFormatada = temp.toString().replace('.', ',');

    const msg =
      temp < 16
        ? `ba cpx ta loco ${tempFormatada} grau`
        : `${tempFormatada} ta mec B)`;

    await this.context.interaction.editReply(msg);
  }
}
