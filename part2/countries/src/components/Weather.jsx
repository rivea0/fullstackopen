import { useEffect, useState } from 'react';
import countriesService from '../services/countries';

const Weather = ({ latitude, longitude }) => {
  // Data from WMO Weather interpretation codes https://open-meteo.com/en/docs 
  const weatherCodes = {
    '0': 'Clear sky',
    '1': 'Mainly clear',
    '2': 'Partly cloudy',
    '3': 'Overcast',
    '45': 'Fog',
    '48': 'Depositing rime fog',
    '51': 'Light drizzle',
    '53': 'Moderate drizzle',
    '55': 'Dense intensity drizzle',
    '56': 'Light freezing drizzle',
    '57': 'Dense intensity freezing drizzle',
    '61': 'Slight rain',
    '63': 'Moderate rain',
    '65': 'Heavy intensity rain',
    '66': 'Light freezing rain',
    '67': 'Heavy intensity freezing rain',
    '71': 'Slight snow fall',
    '73': 'Moderate snow fall',
    '75': 'Heavy intensity snow fall',
    '77': 'Snow grains',
    '80': 'Slight rain showers',
    '81': 'Moderate rain showers',
    '82': 'Violent rain showers',
    '85': 'Slight snow showers',
    '86': 'Heavy snow showers',
    '95': 'Thunderstorm',
    '96': 'Thunderstorm with slight hail',
    '99': 'Thunderstorm with heavy hail'
  };

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    countriesService
      .getCapitalWeather(latitude, longitude)
      .then(weather => {
        setWeatherData(weather);
      })
      .catch(error => {
        console.log('Could not fetch weather data');
      })
  }, [latitude, longitude]);

  if (!weatherData) {
    return null;
  }

  return (
    <div>
      <div>Temperature: {weatherData.current.temperature_2m} {weatherData.current_units.temperature_2m}</div>
      <div>Weather condition: {weatherCodes[weatherData.current.weather_code]}</div>
      <div>Wind speed: {weatherData.current.wind_speed_10m} {weatherData.current_units.wind_speed_10m}</div>
    </div>
  );
}

export default Weather;
