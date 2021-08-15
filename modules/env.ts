import dotenv from 'dotenv';

dotenv.config();

export interface Env extends NodeJS.ProcessEnv {
  DISCORD_TOKEN: string;
  OPENWEATHERMAP_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PW: string;
  CODIGO_SECULLUM_INTERNO: string;
}

export const env = process.env as Env;
