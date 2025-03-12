import axios from 'axios';

const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const countryBaseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name';

const getAll = () => {
  const request = axios.get(allCountriesUrl);
  return request.then(response => response.data);
}

const getCountry = (name) => {
  const request = axios.get(`${countryBaseUrl}/${name}`);
  return request.then(response => response.data);
}

export default { getAll, getCountry };
