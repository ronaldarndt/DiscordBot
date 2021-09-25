import { singleton } from 'tsyringe';
import { fetchJsonAsync } from '../modules/requests';
import { OpenWeatherMapQueryResult } from '../modules/types';

const key = process.env.OPENWEATHERMAP_KEY;

@singleton()
class WeatherService {
  async getAsync(location: string) {
    return fetchJsonAsync<OpenWeatherMapQueryResult | undefined>(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${key}`
    );
  }
}

export { WeatherService };
