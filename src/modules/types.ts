import { AudioPlayer } from '@discordjs/voice';
import { Message } from 'discord.js';
import { Video } from 'ytsr';

type CommandHandler = (message: Message, ...args: unknown[]) => void;

type Constructor<T> = new (...args: any[]) => T;
type ConstructorlessClass = { [key: string]: any };
type ConstructorClass = Constructor<unknown> & ConstructorlessClass;
type Class = ConstructorClass | ConstructorlessClass;

interface GuildPlayer {
  player: AudioPlayer;
  queue: Array<Video>;
}

interface OpenWeatherMapQueryResult {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dts: number;
  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  id: number;
  name: string;
  cod: number;
}

interface BancoSecullum {
  erro: string | null;
  tipo: number;
  nome: string;
  identificador: string;
  plano: number;
  documento: string;
  configEspecial: string | null;
}

export type {
  CommandHandler,
  Constructor,
  Class,
  GuildPlayer,
  OpenWeatherMapQueryResult,
  BancoSecullum
};
