import dotenv from 'dotenv';

dotenv.config();

interface Env extends NodeJS.ProcessEnv {
  DISCORD_TOKEN: string;
  OPENWEATHERMAP_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PW: string;
  CODIGO_SECULLUM_INTERNO: string;
}

const env = process.env as Env;

export { Env, env };
