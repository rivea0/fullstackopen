import Weather from './Weather';

const Country = ({ countryData }) => {
  return (
    <div>
      <h1>{countryData.name}</h1>
      <p>Capital: {countryData.capital}</p>
      <p>Area: {countryData.area}</p>
      <h2>Languages</h2>
      <ul>
        {countryData.languages.map(language => <li key={language}>{language}</li>)}
      </ul>
      <div>
        <img src={countryData.flagImgSrc} alt={countryData.flagImgAltText} />
      </div>
      <h1>Weather in {countryData.capital}</h1>
      <Weather
        latitude={countryData.capitalLatLon[0]}
        longitude={countryData.capitalLatLon[1]}
      />
    </div>
  );
}

export default Country;
