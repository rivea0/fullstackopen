import axios from 'axios';

const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const countryBaseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name';
const weatherBaseUrl = 'https://api.open-meteo.com/v1/forecast';

const getAll = () => {
  const request = axios.get(allCountriesUrl);
  return request.then(response => response.data);
}

const getCountry = (name) => {
  const request = axios.get(`${countryBaseUrl}/${name}`);
  return request.then(response => response.data);
}

const getCapitalWeather = (lat, lon) => {
  let url = `${weatherBaseUrl}?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`;
  const request = axios.get(url);
  return request.then(response => response.data);
}

export default { getAll, getCountry, getCapitalWeather };
