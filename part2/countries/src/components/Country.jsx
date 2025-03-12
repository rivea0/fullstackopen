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
    </div>
  );
}

export default Country;
