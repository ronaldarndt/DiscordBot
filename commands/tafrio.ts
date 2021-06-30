import { Message } from 'discord.js';
import fetch from 'node-fetch';
import { Command } from '.';

const key = process.env.OPENWEATHERMAP_KEY;

export default class PingCommand implements Command {
  async handler(message: Message) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=porto alegre&units=metric&appid=${key}`
    );

    const dados = await res.json();

    const temp = dados.main.temp as number;
    const tempFormatada = temp.toString().replace('.', ',');

    await message.channel.send(
      temp < 16
        ? `ba cpx ta loco ${tempFormatada} grau`
        : `${tempFormatada} ta mec B)`
    );
  }

  help() {
    return `Responde se ta frio ou nao.\nExemplo: !tafrio\nBot: ba cpx ta sim, 8 grau`;
  }
}
