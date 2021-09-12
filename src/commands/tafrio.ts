import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { optional } from '../lib/commandDecorators';
import { Command } from '../lib/commands';

const key = process.env.OPENWEATHERMAP_KEY;

@injectable()
export default class TafrioCommand extends Command {
  async handlerAsync(@optional cidade: string = 'porto alegre') {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${key}`
    );

    const dados = await res.json();

    const temp = dados.main.temp as number;
    const tempFormatada = temp.toString().replace('.', ',');

    await this.replyAsync(
      temp < 16
        ? `ba cpx ta loco ${tempFormatada} grau`
        : `${tempFormatada} ta mec B)`
    );
  }

  static help() {
    return `Responde se ta frio ou nao.\nExemplo: !tafrio\nBot: ba cpx ta sim, 8 grau`;
  }
}
