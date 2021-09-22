import dotenv from 'dotenv';

dotenv.config();

interface Env {
  DISCORD_TOKEN: string;
  OPENWEATHERMAP_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PW: string;
  CODIGO_SECULLUM_INTERNO: string;
  BOT_ID: string;
  GUILD_ID: string;
  DEV: boolean;
}

const env = {
  ...process.env,
  DEV: process.env.NODE_ENV === 'development'
} as Env;

export { Env, env };
