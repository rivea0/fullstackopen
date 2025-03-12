import { useEffect, useState } from 'react';
import countriesService from '../services/countries';
import Country from './Country';

const CountryListItem = ({ name }) => {
  const [isShown, setIsShown] = useState(false);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (isShown) {
      countriesService
        .getCountry(name.toLowerCase())
        .then(returnedCountry => {
          setCountryData({
            name: returnedCountry.name.common,
            capital: returnedCountry.capital,
            capitalLatLon: returnedCountry.capitalInfo.latlng,
            area: returnedCountry.area,
            languages: Object.values(returnedCountry.languages),
            flagImgSrc: returnedCountry.flags.png,
            flagImgAltText: returnedCountry.flags.alt
          });
        })
        .catch(error => {
          console.log('Could not get country data');
        });
    }
  }, [isShown, name]);

  return (
    <>
      <div>
        {name} &nbsp;
        <button onClick={() => setIsShown(prevIsShown => !prevIsShown)}>
          {isShown ? 'hide' : 'show'}
        </button>
      </div>
      {isShown && countryData && <Country countryData={countryData} />}
    </>
  );
}

export default CountryListItem;
