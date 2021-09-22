import { Message } from 'discord.js';

type CommandHandler = (message: Message, ...args: unknown[]) => void;

type Constructor<T> = new (...args: any[]) => T;
type ConstructorlessClass = { [key: string]: any };
type ConstructorClass = Constructor<unknown> & ConstructorlessClass;
type Class = ConstructorClass | ConstructorlessClass;

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

export type { CommandHandler, Constructor, Class, OpenWeatherMapQueryResult };
